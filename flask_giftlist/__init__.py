from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
#from werkzeug.contrib.fixers import ProxyFix
#import models
#import forms
#import os
import config
from .auth import login_manager
from .giftlist.views import giftlist_blueprint
from .giftlist.admin.views import admin
from .giftlist.public.views import public
from .users.views import users
from .data import db

app = Flask(__name__)
app.config.from_object(config.BaseConfiguration)


#db = SQLAlchemy()


db.init_app(app)

login_manager.init_app(app)

app.register_blueprint(giftlist_blueprint)
app.register_blueprint(admin)
app.register_blueprint(public)
app.register_blueprint(users)

