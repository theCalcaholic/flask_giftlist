from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
import pbkdf2
import hashlib

db = SQLAlchemy()

class Gift(db.Model):
    __tablename__ = 'gift'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    url = db.Column(db.String)
    mail_text = db.Column(db.String)
    gifter = db.relationship('Gifter', backref='gift', lazy='select')
    gift_list = db.Column(db.Integer, db.ForeignKey('giftlist.id'))

    def __repr__(self):
        return '<Gift %r>' % (self.name)

    def __str__(self):
        return self.name + '(' + self.url + '):' + self.description


class GiftList(db.Model):
    __tablename__ = 'giftlist'

    id = db.Column(db.Integer, primary_key=True)
    gifts = db.relationship('Gift', backref='gift_list', lazy='select')


class Gifter(db.Model):
    __tablename__ = 'gifter'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    surname = db.Column(db.String)
    email = db.Column(db.String)


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    _password = db.Column(db.LargeBinary(120))
    _salt = db.Column(db.String(120))
    gift_list_id = db.Column(db.Integer, db.ForeignKey('giftlist.id'))
    gift_list = db.relationship('GiftList', backref='owners')
    
    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        if self._salt is None:
            self._salt = bytes(SystemRandom().getrandbits(128))
        self._password = self._hash_password(value)

    def is_valid_password(self, password):
        new_hash = self._hash_password(password)
        return pbkdf2.compare_digest(new_hash, self._password)

    def _hash_password(self, password):
        pwd = password.encode("utf-8")
        salt = bytes(self._salt)
        buff = pbkdf2.pbkdf2(hashlib.sha512, pwd, salt, iterations=100000)
        return bytes(buff)

    def __repr__(self):
        return "<User #{:d}>".format(self.id)
