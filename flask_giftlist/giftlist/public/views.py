from flask import Flask, render_template, request, Blueprint, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user
from werkzeug.contrib.fixers import ProxyFix
from ..models import Gift, GiftList, Gifter
from .forms import ClaimGiftForm
import os

public = Blueprint("giftlist_public", __name__)

@public.route('/', methods = ['GET', 'POST'])
def index():
    lists = GiftList.query.filter(GiftList.show==True)
    gifts = []
    for gift_list in lists:
        gifts.extend(gift_list.gifts)
    gifts = filter(lambda g: (not g.gifter), gifts)
    claim_form = ClaimGiftForm()
    if request.method == 'POST' and claim_form.validate_on_submit():
        return claim_gift(claim_form)
    else:
        return render_template(
            'giftlist/public/index.htm', 
            gifts=gifts,
            claim_form=claim_form, 
            logged_in=(not current_user.is_anonymous()))

@public.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
