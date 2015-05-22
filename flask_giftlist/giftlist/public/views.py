from flask import Flask, render_template, request, Blueprint, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import current_user
from werkzeug.contrib.fixers import ProxyFix
from ..models import Gift, Gifter
from .forms import ClaimGiftForm
from ..admin.forms import GiftForm
import os

public = Blueprint("giftlist_public", __name__)

@public.route('/', methods = ['GET', 'POST'])
def index():
    gifts = Gift.query.filter(Gift.gifter == None)
    if current_user.is_anonymous():
        form = ClaimGiftForm()
    else:
        form = GiftForm()
    if request.method == 'POST' and claim_form.validate_on_submit():
        return claim_gift(claim_form)
    else:
        return render_template(
            'giftlist/public/index.htm', 
            gifts=gifts,
            gift_form=form, 
            logged_in=(not current_user.is_anonymous()))

@public.route('/claim/', methods = ['GET', 'POST'])
def claim_gift():
    return 'claimed'

@public.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

#giftlist.wsgi_app = ProxyFix(giftlist.wsgi_app)
	
