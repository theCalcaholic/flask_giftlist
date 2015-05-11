from random import SystemRandom
from backports.pbkdf2 import pbkdf2_hmac, compare_digest
import hashlib
from flask.ext.login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_giftlist.data import db, CRUDMixin
#from flask.ext.sqlalchemy import SQLAlchemy

#db = SQLAlchemy()

class User(UserMixin, CRUDMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True)
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
        return compare_digest(new_hash, self._password)

    def _hash_password(self, password):
        pwd = password.encode("utf-8")
        salt = bytes(self._salt)
        buff = pbkdf2_hmac("sha512", pwd, salt, iterations=100000)
        return bytes(buff)

    def __repr__(self):
        return "<User #{:d}>".format(self.id)
