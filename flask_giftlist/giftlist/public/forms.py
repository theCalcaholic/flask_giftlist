#from flask.ext.uploads import UploadSet, IMAGES
from flask_wtf import Form, RecaptchaField
from flask_wtf.file import FileRequired, FileAllowed, FileField
from wtforms import TextField, HiddenField, TextAreaField, \
        IntegerField, BooleanField, SubmitField, validators
from wtforms.fields.html5 import URLField, DecimalField, EmailField
from wtforms.validators import url, email
from wtforms.widgets import HiddenInput
from werkzeug.datastructures import MultiDict

error_field_required = 'Dieses Feld darf nicht leer sein.'

class ClaimGiftForm(Form):
    gift_id = IntegerField(default="{{ giftId }}", widget=HiddenInput())
    surname = TextField(
            'Vorname',
            validators=[validators.Required(error_field_required)])
    name = TextField(
        'Name',
        validators=[validators.Required(error_field_required)])
    email = EmailField(
            'E-Mail',
            validators=[
                validators.email('Keine g&uuml;ltige E-Mail-Adresse!'), 
                validators.Required(error_field_required)])
    email_confirm = EmailField(
            u'E-Mail best\xe4tigen',
            validators=[
                validators.Required(error_field_required),
                validators.EqualTo('email_confirm', message='Die E-Mail-Adressen m&uuml;ssen &uuml;bereinstimmen!')])
    #recaptcha = RecaptchaField()

