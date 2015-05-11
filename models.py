from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Gift(db.Model):
    __tablename__ = 'gift'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    url = db.Column(db.String)
    mail_text = db.Column(db.String)
    gifter = db.relationship('Gifter', backref='gift', lazy='select')

    def __repr__(self):
        return '<Gift %r>' % (self.name)

    def __str__(self):
        return self.name + '(' + self.url + '):' + self.description

class Gifter(db.Model):
    __tablename__ = 'gifter'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    surname = db.Column(db.String)
    email = db.Column(db.String)
