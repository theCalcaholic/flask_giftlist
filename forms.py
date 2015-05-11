#from flask.ext.uploads import UploadSet, IMAGES
from flask_wtf import Form, RecaptchaField
from flask_wtf.file import FileRequired, FileAllowed, FileField
from wtforms import TextField, validators
from wtforms.fields.html5 import URLField, DecimalField, EmailField
from wtforms.validators import DataRequired, url, email

image_extensions = ['jpg', 'gif', 'png', 'bmp', 'svg', 'tiff']

class GiftForm(Form):
    name = TextField('Name', validators = [validators.Required()])
    description = TextField()
    url = URLField(
            validators=[url()])
    prize = DecimalField(
            'Preis (ca.)',
            validators=[DataRequired()])
    image = FileField(
            'image', 
            validators=[
                FileRequired(),
                FileAllowed(image_extensions, 'Images only!')])
    recaptcha = RecaptchaField()

class ClaimGiftForm(Form):
    surname = TextField(
            'Vorname',
            validators=[DataRequired()])
    name = TextField(
        'Name',
        validators=[DataRequired()])
    email = EmailField(
            'E-Mail',
            validators=[
                email(), 
                DataRequired()])
    email_confirm = EmailField(
            'E-Mail best&auml;tigen',
            validators=[
                validators.Required(),
                validators.EqualTo('email_confirm', message='Die E-Mail-Adressen m&uuml;ssen &uuml;bereinstimmen!')])
    recaptcha = RecaptchaField()

