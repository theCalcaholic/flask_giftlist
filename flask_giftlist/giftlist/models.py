# -*- coding: utf-8 -*-

from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_giftlist.data import db, CRUDMixin
from werkzeug.datastructures import MultiDict
import pbkdf2
import hashlib

"""gifts_x_gifters = db.Table('association', db.MetaData(),
    db.Column('gift_id', db.Integer, db.ForeignKey('gift.id')),
    db.Column('gifter_id', db.Integer, db.ForeignKey('gifter.id')))"""

class Gift(db.Model, CRUDMixin):
    __tablename__ = 'gift'

    id = db.Column(db.Integer, primary_key=True)
    giftName = db.Column(db.String)
    prize = db.Column(db.Integer)
    description = db.Column(db.String)
    url = db.Column(db.String)
    image = db.Column(db.String)
    mailText = db.Column(db.String)
    collaborative = db.Column(db.Boolean, default=False)
    gifters = db.relationship("Gifter", backref="gift", lazy="select")
    remaining_prize = db.Column(db.Integer)
    """gifters = db.relationship(
            "Gifter", 
            secondary=gifts_x_gifters, 
            backref="gifts")"""

    def __repr__(self):
        return '<Gift %r>' % (self.name)

    def __str__(self):
        return self.name + '(' + self.url + '):' + self.description

    def data(self):
        return MultiDict(self.__dict__)

    def mail(self):
        return u"""Geschenk: {name:s}
Preis (ca): {prize:d}€
Beschreibung: {desc:s}
Link: {url:s}

{mail_text:s}""".format(
                name=self.giftName or '',
                prize=self.prize or '',
                desc=self.description or '',
                url=self.url or '',
                mail_text=self.mailText or '')

    def dict(self):
        return {
            'id': self.id,
            'giftName': self.giftName,
            'prize': self.prize,
            'remaining_prize': self.remaining_prize,
            'description': self.description,
            'url': self.url,
            'image': self.image,
            'mailText': self.mailText,
            'collaborative': self.collaborative}


"""class GiftList(db.Model, CRUDMixin):
__tablename__ = 'giftlist'

id = db.Column(db.Integer, primary_key=True)
gifts = db.relationship('Gift', backref='gift_list', lazy='select')
show = db.Column(db.Boolean)"""

class Gifter(db.Model, CRUDMixin):
    __tablename__ = 'gifter'

    id = db.Column(db.Integer, primary_key=True)
    lastname = db.Column(db.String)
    surname = db.Column(db.String)
    email = db.Column(db.String)
    gift_id = db.Column(db.Integer, db.ForeignKey('gift.id'))


