from os.path import abspath, dirname, join

_cwd = dirname(abspath(__file__))

class BaseConfiguration(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'flask-session-insecure-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + join(_cwd, 'data.db')
    SQLALCHEMY_ECHO = True
    WTF_CSRF_SECRET_KEY = 'development_key'
    WTF_SCRF_ENABLED = False
    HASH_ROUND = 100000
    RECAPTCHA_PUBLIC_KEY = 'recapp_development_key'
    BABEL_DEFAULT_LOCALE = 'de'
    UPLOAD_DIR = 'uploads'

    MAIL_SERVER = 'localhost'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    #MAIL_USE_SSL
    MAIL_USERNAME = 'hidden'
    MAIL_PASSWORD = 'hidden'
    #DEFAULT_MAIL_SENDER


class TestConfiguration(BaseConfiguration):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    HASH_ROUND = 1 
