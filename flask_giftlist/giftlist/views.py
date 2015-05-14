from flask import Flask, render_template, request, Blueprint, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user, login_required
from werkzeug.contrib.fixers import ProxyFix
from .models import Gift, GiftList
from .forms import ClaimGiftForm, GiftForm, ListSettingsForm
import os

giftlist = Blueprint("giftlist", __name__)

@giftlist.route('/')
def index():
    lists = GiftList.query.filter(GiftList.show==True)
    gifts = []
    for gift_list in lists:
        gifts.extend(gift_list.gifts)

    gifts = filter(lambda g: (not g.gifter), gifts)

    claim_form = ClaimGiftForm()
    return render_template(
            'index.htm', 
            gifts=gifts,
            claim_form=claim_form, 
            logged_in=(not current_user.is_anonymous()))

@giftlist.route('/claim/')
def claim_gift():
    return 'claim!'

@giftlist.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@giftlist.route('/lists/')
@login_required
def show_lists():
    lists = GiftList.query.all()
    return render_template('showLists.htm', lists=lists)

@giftlist.route('/list/new/', methods=['POST'])
@login_required
def add_list():
    d = {"show": False}
    gift_list = GiftList.create(**d)
    return redirect(url_for('.edit_list', gift_list_id=gift_list.id))

@giftlist.route('/list/<int:gift_list_id>/', methods=['POST', 'GET'])
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
        return render_template('list.htm', gift_list=gift_list, edit_gift_form=edit_gift_form, gift_form=gift_form, list_settings_form=list_settings_form)
    return render_template('listNotFound.htm')
    
@giftlist.route('/gift/new/', methods=['POST'])
@login_required
def add_gift():
    return edit_gift(None)

@giftlist.route('/gift/<int:gift_id>/', methods=['POST','GET'])
@login_required
def edit_gift(gift_id):
    gift_form = GiftForm()
    try:
        int(gift_form.gift_list_id.data)
        if gift_form.validate_on_submit():
            new_data = gift_form.data.copy()
            new_data['prize'] = int(new_data['prize'])
            if gift_id:
                gift = Gift.query.filter(Gift.id==gift_id).first()
                gift.update(**new_data)
                return 'gift saved'
            else:
                new_gift = gift_form.data.copy()
                #new_gift['image'] = "yes"
                new_gift['prize'] = int(new_gift['prize'])
                gift = Gift.create(**new_gift)
                #return 'new gift created: ' + str(gift.gift_list_id) + '/' #+ str(dump(new_gift))#['gift_list_id'])
            return redirect(url_for('.edit_list', gift_list_id=gift_form.gift_list_id.data))
        return render_template('editGift.htm', gift_list=gift_form.gift_list_id, edit_gift_form=gift_form)
    except ValueError:
        return 'invalid list id'
        return redirect(url_for('.show_lists'))

#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
if __name__=='__main__':
        with app.app_context():
            db.create_all()
	app.run(debug=True)
