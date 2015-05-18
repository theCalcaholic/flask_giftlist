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

class GiftForm(Form):
    name = TextField('Name', validators = [validators.Required()])
    gift_list_id = IntegerField("list id", widget=HiddenInput(),
            validators = [validators.Required('An error has occurred. Please try again.')])
    prize = DecimalField(
            'Preis (ca.)',
            validators=[validators.Required()])
    url = URLField('URL',
            validators=[url()])
    description = TextField('Beschreibung')
    mail_text = TextAreaField('E-Mail-Text')
    image = FileField(
            'image')#, 
            #validators=[])
                #FileRequired(),
                #FileAllowed(image_extensions, 'Images only!')])
    #recaptcha = RecaptchaField()

    def populate_with(self, obj):
        if obj.name:
            self.name.data = obj.name
        if obj.gift_list_id:
            self.gift_list_id.data = obj.gift_list_id
        if obj.prize:
            self.prize.data = obj.prize
        if obj.url:
            self.url.data = obj.url
        if obj.description:
            self.description.data = obj.description
        if obj.mail_text:
            self.mail_text.data = obj.mail_text
        if obj.image:
            self.image.data = obj.image

    def reset(self):
        blankData = MultiDict([('csrf', self.generate_csrf_token())])
        self.process(blankData)


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

class ListSettingsForm(Form):
    show = BooleanField('auf Startseite anzeigen')
    submit = SubmitField(
            default='Senden',
            validators=[])
    delete = SubmitField(
            default='Liste l&ouml;schen',
            validators=[])