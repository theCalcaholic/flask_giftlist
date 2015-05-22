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
    name = TextField(validators = [validators.Required()])
    prize = TextField(validators=[validators.Required()])
    url = URLField(
            validators=[
                validators.Optional(),
                url()])
    description = TextField()
    mail_text = TextAreaField()
    image = FileField(validators=[FileAllowed(image_extensions, 'Images only!')])
    #recaptcha = RecaptchaField()

    def populate_with(self, obj):
        if obj.name:
            self.name.data = obj.name
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


class ListSettingsForm(Form):
    show = BooleanField('auf Startseite anzeigen')
    submit = SubmitField(
            default='Senden',
            validators=[])
    delete = SubmitField(
            default='Liste l&ouml;schen',
            validators=[])
