# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Blueprint, redirect, url_for, current_app, jsonify, Response, session
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user, login_required
from flask.ext.mail import Mail, Message
from werkzeug import secure_filename
from werkzeug.contrib.fixers import ProxyFix
from .models import Gift, Gifter
from .forms import GiftForm, ClaimGiftForm
import os

giftlist = Blueprint("giftlist", __name__)
mail = Mail()

default_mail_start = u"Liebe/r {surname} {lastname},\n\rVielen Dank für die Reservierung des Geschenks.\n\r\n\r"
default_mail_end = u"\n\rLiebe Grüße, Henrike und Tobias"

@giftlist.route('/', methods = ['GET', 'POST'])
def index(gift_form=None):
    gifts = Gift.query.filter(Gift.gifter == None)
    if current_user.is_anonymous():
        form = ClaimGiftForm()
    elif gift_form:
        form = gift_form
    else:
        form = GiftForm(csrf_enabled=False)
    if request.method == 'POST' and claim_form.validate_on_submit():
        return claim_gift(claim_form)
    else:
        return render_template(
            'giftlist/index.htm', 
            gifts=gifts,
            gift_form=form, 
            showMail=True,
            logged_in=(not current_user.is_anonymous()))

@giftlist.route('/claim/')
def redirect_claim_gift():
    if 'selected_gift' in session:
        return redirect('/#/claim/');
    return redirect('/');

@giftlist.route('/ajax/claim/<int:gift_id>/', methods = ['GET', 'POST'])
def claim_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id, Gift.gifter==None).first()
    
    if gift:
        claim_form = ClaimGiftForm(csrf_enabled=False)
        if claim_form.validate_on_submit():
            new_data = claim_form.data.copy()
            del new_data['email_confirm']
            gifter = Gifter.create(**new_data)
            if gifter:
                gift.gifter = gifter
                msg=Message("Hochzeitsgeschenk",
                    sender = ("Tobias Knöppler", "toberrrt@online.de"),
                    recipients = [(gifter.surname + " " + gifter.lastname, 
                        gifter.email)])
                msg.body = default_mail_start.format(
                       surname=gifter.surname,
                       lastname=gifter.lastname)\
                    + gift.mail() + default_mail_end
                mail.send(msg)
                return jsonify({'errors':[]})
            else:
                return jsonify({
                    'errors': ['Der Schenkende konnte nicht angelegt werden']})
        else:
            return jsonify({
                'errors': ['Die angegebenen Daten sind ungültig!'] + form_errors(claim_form)})
    else:
        return jsonify({
            'errors': ['Das Geschenk konnte nicht reserviert werden.']}), 404
    return jsonify({'errors': []})

@giftlist.route('/ajax/gift/new/', methods=['GET', 'POST'])
@login_required
def add_gift():
    gift_form = GiftForm(csrf_enabled=False)
    new_data = process_gift_form(gift_form)
    if request.method == 'POST' and new_data:
        gift = Gift.create(**new_data)
        if gift:
            return jsonify({'errors': []})
        else:
            return jsonify({'errors':['Konnte Datenbankeintrag nicht speichern.']})
    elif not new_data:
        return jsonify({
            'errors': ["Ungültige Geschenk-Daten:"] + form_errors(gift_form)})
    else:
        return jsonify({'errors': ['unbekannter Fehler.']})

@giftlist.route('/ajax/gift/<int:gift_id>/save/', methods=['PUT', 'POST','GET'])
@login_required
def edit_gift(gift_id):
    gift_form = GiftForm(csrf_enabled=False)
    gift = Gift.query.filter(Gift.id==gift_id).first()
    new_data = process_gift_form(gift_form)
    if new_data:
        if not gift:
            return jsonif({
                'success': False,
                'errors': ["Das Geschenk konnte nicht gefunden werden."]}), 404
        gift.update(**new_data)
        return jsonify({'success': True, 'errors': []})
    else:
        return jsonify({
            'success': False,
            'errors': ['Die angegebenen Geschenk-Daten sind ungültig.']})
    return render_template('giftlist/editGift.htm', edit_gift_form=gift_form)

@giftlist.route('/ajax/gift/<int:gift_id>/delete/', methods=['POST'])
@login_required
def delete_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if gift:
        gift.delete()
        return jsonify({'errors': {}});
    return jsonify({'errors': ["Geschenk nicht gefunden."]}), 404

@giftlist.route('/ajax/gifts/')
def gifts_as_json():
    gifts = [ gift.dict() for gift in Gift.query.filter(Gift.gifter==None) ]
    return jsonify(success = True,
            loggedIn = True,
            gifts = gifts)

@giftlist.route('/ajax/template/<path:template_path>')
def get_template(template_path):
    base_path = os.path.join(current_app.root_path, current_app.template_folder)
    if os.path.isfile(os.path.join(base_path, 'ajax', template_path)):
        return render_template(os.path.join('ajax', template_path), logged_in=(not current_user.is_anonymous()))
    return render_template('error/404.html'), 404

@giftlist.route('/ajax/template/claimDialog.html')
def get_claimdialog_template():
    claim_form = ClaimGiftForm()
    return render_template('ajax/claimDialog.html', claim_form=claim_form)

@giftlist.route('/ajax/template/editDialog.html')
def get_editdialog_template():
    edit_form = GiftForm()
    """return jsonify({
        'urlField': edit_form.url(),
        'requiredFlag': edit_form.url.flags.required,
        'optionalFlag': edit_form.url.flags.optional}), 200"""
    return render_template('ajax/editDialog.html', edit_form = edit_form)


def process_gift_form(form):
    if not form.validate_on_submit():
        print(form.errors)
        return None
    data = form.data
    data['prize'] = float(data['prize'])
    if form.imageFile.data:
        #print("imageFile.data: " + form.imageFile.data)
        image_name = secure_filename(form.imageFile.data.filename)
        uploads_dir = os.path.normpath(os.path.join(
            current_app.static_folder, 
            current_app.config.get('UPLOAD_DIR')))
        i = 1
        while os.path.isfile(os.path.join(uploads_dir, image_name)):
            file_parts = os.path.splitext(form.imageFile.data.filename)
            image_name = file_parts[0] \
                    + '_' + str(i) \
                    + file_parts[1]
            i += 1
        image_path = os.path.join(current_app.config.get('UPLOAD_DIR'), image_name)
        print( 'Saving image as ' + image_path )
        form.imageFile.data.save(os.path.join(uploads_dir, image_name))
        data['image'] = url_for('static', filename=image_path)
    else:
        print('No image transmitted')
        data['image'] = None
    return data

def form_errors(form):
    return [field + ': ' + ';'.join(errors) for field, errors in form.errors.iteritems()]



#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
