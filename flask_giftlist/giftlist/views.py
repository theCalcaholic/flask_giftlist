# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Blueprint, redirect, url_for, current_app, jsonify, Response, session
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import func, or_
from flask.ext.login import current_user, login_required
from flask.ext.mail import Mail, Message
from werkzeug import secure_filename
from werkzeug.contrib.fixers import ProxyFix
from .models import Gift, Gifter
from .forms import GiftForm, ClaimGiftForm
from ..data import db
from urlparse import urlparse
from pprint import pprint
import os

### These are the routes for all views related to managing the gift lists

giftlist = Blueprint("giftlist", __name__)
mail = Mail()

default_mail_start = u"Liebe/r {surname} {lastname},\n\rVielen Dank für die Reservierung des Geschenks.\n\r\n\r"
default_mail_end = u"\n\rLiebe Grüße, Henrike und Tobias"

@giftlist.route('/', methods = ['GET', 'POST'])
def index():
    return render_template(
        'index.htm', 
        logged_in=(not current_user.is_anonymous()))

# Redirect for preventing manual url manipulation (should only be set by the Client App)
# TODO: Save state of Single Page Application in session/cookie and load it if available
@giftlist.route('/claim/')
def redirect_claim_gift():
    return redirect('/');

# Route for claiming gift of id @gift_id
@giftlist.route('/ajax/claim/<int:gift_id>/', methods = ['GET', 'POST'])
def claim_gift(gift_id):
    # TODO: enable csrf
    claim_form = ClaimGiftForm(csrf_enabled=False)
    if not claim_form.validate_on_submit():
        return jsonify({
            'success': False,
            'errors': ['Die angegebenen Daten sind ungültig!'] + form_errors(claim_form)})
    new_data = claim_form.data.copy()
    # TODO: Don't even transmit email_confirm
    del new_data['email_confirm']
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if not gift:
        # TODO: Rethink use of http return values for asynchronous requests.
        return jsonify({
            'success': False,
            'errors': ['Das Geschenk konnte nicht reserviert werden. (No such gift)'] }), 404
    # If gift can not be claimed collaboratively, claim it totally (so that no prize remains for further gifters)
    if not gift.collaborative:
        gift.remaining_prize = 0;
        db.session.commit()
    # Else check if the selected prize is valid
    else: 
        err = None
        if (not "chosen_prize" in new_data):
            err = 'Es muss ein Betrag ausgewählt werden'
        elif new_data["chosen_prize"] > gift.remaining_prize:
            err = 'Der gewählte Betrag darf nicht höher sein als der Gesamtpreis.'
        if err:
            return jsonify({
                'success': False,
                'errors': [err, str(new_data["chosen_prize"]) + " is greater then " + str(gift.remaining_prize)]})
        # If no errors were found, calculate new remaining prize and save changes.
        else:
            gift.remaining_prize = gift.remaining_prize - new_data['chosen_prize']
            db.session.commit();
    # If everything went well so far, create gifter
    gifter = Gifter.create(**new_data)
    if not gifter:
        return jsonify({
            'errors': ['Der Schenkende konnte nicht angelegt werden']})
    # If the gift has no gifter yet or can be claimed collaboratively (and is not already claimed by the newly created gifter)
    if len(gift.gifters) == 0 or gift.collaborative:
        # create message from gifter credentials
        msg_title = "Geschenkreservierung zur Hochzeit von Henrike und Tobias (" + gift.giftName + ")"
        msg = Message("Hochzeitsgeschenk",
            sender = ("Henrike & Tobias Knöppler", "toberrrt@online.de"),
            recipients = [(gifter.surname + " " + gifter.lastname, 
                gifter.email)])
        # create txt mail body
        msg.body = default_mail_start.format(
               surname=gifter.surname,
               lastname=gifter.lastname)\
            + gift.mail() + default_mail_end
        image_is_external = bool(urlparse(gift.image).netloc)
        # create html mail body
        msg.html = render_template(
                "gifterMail.htm",
                title=msg_title,
                gifter=gifter,
                gift=gift,
                image_is_external=image_is_external)
        mail.send(msg)
        gift.gifters.append(gifter)
        db.session.commit()
        return jsonify({
            'success': True,
            'errors':[]})
    else:
        return jsonify({
                'success': False,
                'errors': ['Ein Fehler ist augetreten.']})

@giftlist.route('/ajax/gift/new/', methods=['GET', 'POST'])
@login_required
def add_gift():
    gift_form = GiftForm(csrf_enabled=False)
    new_data = process_gift_form(gift_form)
    new_data["remaining_prize"] = new_data["prize"]
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
            return jsonify({
                'success': False,
                'errors': ["Das Geschenk konnte nicht gefunden werden."]}), 404
        if new_data['prize'] != gift.prize:
            new_data['remaining_prize'] = new_data['prize']
        print("request data:")
        pprint(new_data)
        gift.update(True, **new_data)
        return jsonify({'success': True, 'errors': []})
    else:
        return jsonify({
            'success': False,
            'errors': ['Die angegebenen Geschenk-Daten sind ungültig.']})
    return render_template('giftlist/editGift.htm', edit_gift_form=gift_form)

@giftlist.route('/ajax/gift/<int:gift_id>/duplicate/', methods=['POST'])
@login_required
def duplicate_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if not gift:
        return jsonify({
            'success': False,
            'errors': ['Geschenk nicht gefunden.']})
    else:
        gift_data = gift.dict()
        del gift_data['id']
        Gift.create(True, **gift_data)
        return jsonify({
            'success': True,
            'errors': []})

@giftlist.route('/ajax/gift/<int:gift_id>/delete/', methods=['POST'])
@login_required
def delete_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if gift:
        gift.delete()
        return jsonify({
            'success': True,
            'errors': {}});
    return jsonify({
        'success': False,
        'errors': ["Geschenk nicht gefunden."]}), 404

@giftlist.route('/ajax/gifts/')
def gifts_as_json():
    if current_user.is_anonymous():
        gifts = [ gift.dict() for gift in Gift.query\
                .outerjoin(Gift.gifters)\
                .group_by(Gift.id)\
                .having(or_(func.count(Gifter.id)==0, Gift.remaining_prize>0)).all()
                ]
        pprint(gifts)
    else:
        gifts = [ gift.dict() for gift in Gift.query.all() ]
    return jsonify(success = True,
            loggedIn = True,
            gifts = gifts)

@giftlist.route('/ajax/gifters/')
@login_required
def gifters_as_json():
    gifters = Gifter.query.all()
    return render_template('ajax/giftersList.html', gifters=gifters)

@giftlist.route('/template/<path:template_path>')
def get_template(template_path):
    base_path = os.path.join(current_app.root_path, current_app.template_folder)
    print( 'Looking for template: ' + os.path.join(base_path, 'ng-templates', template_path) );
    if os.path.isfile(os.path.join(base_path, 'ng-templates', template_path)):
        return render_template(os.path.join('ng-templates', template_path), logged_in=(not current_user.is_anonymous()))
    return render_template('error/404.html'), 404

@giftlist.route('/template/claimDialog.html')
def get_claimdialog_template():
    claim_form = ClaimGiftForm()
    return render_template('ng-templates/claimDialog.html', claim_form=claim_form)

@giftlist.route('/template/editDialog.html')
def get_editdialog_template():
    edit_form = GiftForm()
    return render_template('ng-templates/editDialog.html', edit_form = edit_form)


def process_gift_form(form):
    if not form.validate_on_submit():
        print(form.errors)
        return None
    data = form.data
    data['prize'] = float(data['prize'].replace(',', '.'))
    print("url is: <" + form.image.data + ">")
    img_url = urlparse(form.image.data, 'http')
    pprint(img_url)
    if form.deleteImage.data:
        print('deleting image.')
        data['image'] = None
    elif form.imageFile.data:
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
    elif img_url.scheme == "http" and data['image']:
        data["image"] = img_url.geturl()
        print("image_url set to: " + img_url.geturl())
    else:
        print('No image transmitted')
    del data['deleteImage']
    del data['imageFile']
    return data

def form_errors(form):
    if current_app.debug or True:
        return [field + ': ' + ';'.join(errors) for field, errors in form.errors.iteritems()]
    else:
        return []

#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
