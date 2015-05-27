from flask import Flask, render_template, request, Blueprint, redirect, url_for, current_app
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user, login_required
from werkzeug.contrib.fixers import ProxyFix
from .models import Gift, Gifter
from .forms import GiftForm, ClaimGiftForm
import os

giftlist = Blueprint("giftlist", __name__)

@giftlist.route('/', methods = ['GET', 'POST'])
def index(gift_form=None):
    gifts = Gift.query.filter(Gift.gifter == None)
    if current_user.is_anonymous():
        form = ClaimGiftForm()
    elif gift_form:
        form = gift_form
    else:
        form = GiftForm()
    if request.method == 'POST' and claim_form.validate_on_submit():
        return claim_gift(claim_form)
    else:
        return render_template(
            'giftlist/index.htm', 
            gifts=gifts,
            gift_form=form, 
            logged_in=(not current_user.is_anonymous()))

@giftlist.route('/claim/<int:gift_id>/', methods = ['GET', 'POST'])
def claim_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id, Gift.gifter==None).first()
    
    if gift:
        claim_form = ClaimGiftForm()
        if claim_form.validate_on_submit():
            return render_template('giftlist/claimGift.htm', gift=gift, claim_form=claim_form, done=True)
        else:
            return redirect(url_for('.index'), gift_form=claim_form)
    else:
        return 'not found'
        return render_template('giftlist/giftNotAvailable.htm')
    return 'claimed'

@giftlist.route('/gift/new/', methods=['GET', 'POST'])
@login_required
def add_gift():
    gift_form = GiftForm()
    new_data = process_gift_form(gift_form)
    if request.method == 'POST' and new_data:
        gift = Gift.create(**new_data)
        if gift:
            return redirect(url_for('.index', ))
        else:
            return type(gift)
    return render_template('giftlist/editGift.htm', edit_gift_form=gift_form)

@giftlist.route('/gift/<int:gift_id>/', methods=['POST','GET'])
@login_required
def edit_gift(gift_id):
    gift_form = GiftForm()
    gift = Gift.query.filter(Gift.id==gift_id).first()
    new_data = process_gift_form(gift_form)
    if request.method == 'POST' and new_data:
        if not gift:
            return render_template('error/404.html'), 404
        gift.update(**new_data)
        return redirect(url_for('.index'))
    elif gift:
        gift_form.populate_with(gift)
    return render_template('giftlist/editGift.htm', edit_gift_form=gift_form)

@giftlist.route('/gift/<int:gift_id>/delete/')
@login_required
def delete_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if gift:
        gift.delete()
    return redirect(url_for('.index'))

    
def process_gift_form(form):
    if not form.validate_on_submit():
        return None
    data = form.data
    data['prize'] = int(data['prize'])
    if form.image.data:
        image_name = secure_filename(form.image.data.filename)
        uploads_dir = os.path.normpath(os.path.join(
            current_app.static_folder, 
            current_app.config.get('UPLOAD_DIR')))
        i = 1
        while os.path.isfile(os.path.join(uploads_dir, image_name)):
            file_parts = os.path.splitext(form.image.data.filename)
            image_name = file_parts[0] \
                    + '_' + str(i) \
                    + file_parts[1]
            i += 1
        image_path = os.path.join(current_app.config.get('UPLOAD_DIR'), image_name)
        print( 'Saving image as ' + image_path )
        form.image.data.save(os.path.join(uploads_dir, image_name))
        data['image'] = image_path
    else:
        data['image'] = None
    return data



#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
