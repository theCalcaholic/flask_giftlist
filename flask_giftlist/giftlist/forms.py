#from flask.ext.uploads import UploadSet, IMAGES
from flask_wtf import Form, RecaptchaField
from flask_wtf.file import FileRequired, FileAllowed, FileField
from wtforms import TextField, HiddenField, TextAreaField, \
        IntegerField, BooleanField, SubmitField, validators
from wtforms.fields.html5 import URLField, DecimalField, EmailField
from wtforms.validators import url, email
from wtforms.widgets import HiddenInput
from werkzeug.datastructures import MultiDict

image_extensions = ['jpg', 'gif', 'png', 'bmp', 'svg', 'tiff']
error_field_required = 'Dieses Feld darf nicht leer sein.'

class NgTextInput(object):
    def __init__(self, error_class=u'has_errors'):
        super(NgTextInput, self).__init__()
        self.error_class = error_class

    def __call__(self, field, **kwargs):
        pass



class GiftForm(Form):
    giftName = TextField(validators = [validators.Required()])
    prize = TextField(validators=[validators.Required()])
    url = URLField(validators=[validators.URL(), validators.Optional()])
    description = TextField()
    mailText = TextAreaField()
    imageFile = FileField(validators=[FileAllowed(image_extensions, 'Images only!')])
    image = TextField(widget=HiddenInput())
    deleteImage = BooleanField()
    collaborative = BooleanField()

    def reset(self):
        blankData = MultiDict([('csrf', self.generate_csrf_token())])
        self.process(blankData)


class ListSettingsForm(Form):
    show = BooleanField('auf Startseite anzeigen')
    submit = SubmitField(
            default='Senden',
            validators=[])
    delete = SubmitField(
            default='Liste l&ouml;schen',
            validators=[])

class ClaimGiftForm(Form):
    surname = TextField(
            'Vorname',
            validators=[validators.Required(error_field_required)])
    lastname = TextField(
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
    prize = IntegerField()
    #recaptcha = RecaptchaField()

