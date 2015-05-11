from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from werkzeug.contrib.fixers import ProxyFix
import models
import forms
import os
import config
from .data import db
from .auth import login_manager
from .tracking.views import tracking
from .users.views import users

app = Flask(__name__)
app.config.from_object(config.BaseConfiguration)


db.init_app(app)

login_manager.init_app(app)
app.register_blueprint(giftlist)
app.register_blueprint(users)

