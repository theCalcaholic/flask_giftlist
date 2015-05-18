from flask import Flask, render_template, request, Blueprint, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user, login_required
from werkzeug.contrib.fixers import ProxyFix
from ..models import Gift, GiftList, Gifter
#from .. import models
from .forms import GiftForm, ListSettingsForm
import os

admin = Blueprint("giftlist_admin", __name__)

@admin.route('/lists/')
@login_required
def show_lists():
    lists = GiftList.query.all()
    return render_template('giftlist/admin/showLists.htm', lists=lists)

@admin.route('/list/new/', methods=['POST'])
@login_required
def add_list():
    d = {"show": False}
    gift_list = GiftList.create(**d)
    return redirect(url_for('.edit_list', gift_list_id=gift_list.id))

@admin.route('/list/<int:gift_list_id>/', methods=['POST', 'GET'])
@login_required
def edit_list(gift_list_id):
    gift_list = GiftList.query.filter(GiftList.id == gift_list_id).first()
    if gift_list:
        list_settings_form = ListSettingsForm()
        if list_settings_form.validate_on_submit():
            gift_list.update( commit=True, **{"show": list_settings_form.show.data})
        gift_form = GiftForm()
        edit_gift_form = GiftForm()
        list_settings_form.process(**{"show": gift_list.show})
        return render_template('giftlist/admin/list.htm', gift_list=gift_list, edit_gift_form=edit_gift_form, gift_form=gift_form, list_settings_form=list_settings_form)
    return render_template('giftlist/admin/listNotFound.htm')
    
@admin.route('/gift/new/', methods=['GET', 'POST'])
@login_required
def add_gift():
    return edit_gift(None)

@admin.route('/gift/<int:gift_id>/', methods=['POST','GET'])
@login_required
def edit_gift(gift_id):
    gift_form = GiftForm()
    if request.method == 'POST' and gift_form.validate_on_submit():
        new_data = gift_form.data.copy()
        new_data['prize'] = int(new_data['prize'])
        if gift_id:
            gift = Gift.query.filter(Gift.id==gift_id).first()
            gift.update(**new_data)
        else:
            new_gift = gift_form.data.copy()
            #new_gift['image'] = "yes"
            new_gift['prize'] = int(new_gift['prize'])
            gift = Gift.create(**new_gift)
        return redirect(url_for('.edit_list', gift_list_id=gift_form.gift_list_id.data))
    else:
        try:
            int(gift_form.gift_list_id)
        except:
            return render_template('error/404.html'), 404

        return render_template('giftlist/admin/editGift.htm', gift_list=gift_form.gift_list_id, edit_gift_form=gift_form)

    

#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
