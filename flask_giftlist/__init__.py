from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask_wtf.csrf import CsrfProtect
#from werkzeug.contrib.fixers import ProxyFix
#import models
#import forms
#import os
import config_priv
from .auth import login_manager
from .giftlist.views import giftlist, mail
from .users.views import users
from .data import db

app = Flask(__name__)
app.config.from_object(config_priv.PrivateConfiguration)
#CsrfProtect(app)


#db = SQLAlchemy()


db.init_app(app)
mail.init_app(app)

login_manager.init_app(app)

app.register_blueprint(giftlist)
app.register_blueprint(users)

