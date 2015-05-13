from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_giftlist.data import db, CRUDMixin
import pbkdf2
import hashlib


class Gift(db.Model, CRUDMixin):
    __tablename__ = 'gift'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    prize = db.Column(db.Integer)
    description = db.Column(db.String)
    url = db.Column(db.String)
    image = db.Column(db.String)
    mail_text = db.Column(db.String)
    gift_list_id = db.Column(db.Integer, db.ForeignKey('giftlist.id'))
    gifter_id = db.Column(db.Integer, db.ForeignKey('gifter.id'))

    def __repr__(self):
        return '<Gift %r>' % (self.name)

    def __str__(self):
        return self.name + '(' + self.url + '):' + self.description


class GiftList(db.Model, CRUDMixin):
    __tablename__ = 'giftlist'

    id = db.Column(db.Integer, primary_key=True)
    gifts = db.relationship('Gift', backref='gift_list', lazy='select')
    show = db.Column(db.Boolean)


class Gifter(db.Model, CRUDMixin):
    __tablename__ = 'gifter'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    surname = db.Column(db.String)
    email = db.Column(db.String)
    gifts = db.relationship("Gift", backref="gifter", lazy="select")


