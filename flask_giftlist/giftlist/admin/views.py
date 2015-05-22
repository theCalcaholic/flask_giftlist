from flask import Flask, render_template, request, Blueprint, redirect, url_for, current_app
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user, login_required
from werkzeug import secure_filename
from werkzeug.contrib.fixers import ProxyFix
from ..models import Gift, Gifter
from .forms import GiftForm, ListSettingsForm
import os

admin = Blueprint("giftlist_admin", __name__)

@admin.route('/gift/new/', methods=['GET', 'POST'])
@login_required
def add_gift():
    gift_form = GiftForm()
    new_data = process_gift_form(gift_form)
    if request.method == 'POST' and new_data:
        gift = Gift.create(**new_data)
        return redirect(url_for('giftlist_public.index'))
    return render_template('giftlist/admin/editGift.htm', edit_gift_form=gift_form)

@admin.route('/gift/<int:gift_id>/', methods=['POST','GET'])
@login_required
def edit_gift(gift_id):
    gift_form = GiftForm()
    gift = Gift.query.filter(Gift.id==gift_id).first()
    new_data = process_gift_form(gift_form)
    if request.method == 'POST' and new_data:
        if not gift:
            return render_template('error/404.html'), 404
        gift.update(**new_data)
        return redirect(url_for('giftlist_public.index'))
    elif gift:
        gift_form.populate_with(gift)
    return render_template('giftlist/admin/editGift.htm', gift_list_id=gift.gift_list_id, edit_gift_form=gift_form)

@admin.route('/gift/<int:gift_id>/delete/')
@login_required
def delete_gift(gift_id):
    gift = Gift.query.filter(Gift.id==gift_id).first()
    if gift:
        gift.delete()
    return redirect(url_for('giftlist_public.index'))

    
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
	
