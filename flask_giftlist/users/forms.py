#from flask.ext.uploads import UploadSet, IMAGES
from flask_wtf import Form, RecaptchaField
from wtforms import TextField, PasswordField, validators
from .models import User

image_extensions = ['jpg', 'gif', 'png', 'bmp', 'svg', 'tiff']

class LoginForm(Form):
    login = TextField('Login', 
            validators = [validators.Required()])
    password = PasswordField('Passwort', 
            validators = [validators.Required()])
    #recaptcha = RecaptchaField()

    def validate_password(form, field):
        try:
            user = User.query.filter(User.login == form.login.data).one()
        except (MultipleResultsFound, NoResultFound):
            raise ValidationError("Invalid user")
        if user is None:
            raise ValidationError("Invalid user")
        if not user.is_valid_password(form.password.data):
            raise ValidationError("Invalid password")
        form.user = user


class RegistrationForm(Form):
    login = TextField('Login', 
            validators = [validators.Required()])
    email = TextField('E-Mail', 
            validators = [
                validators.Email(),
                validators.Required()])
    email_confirm = TextField('E-Mail wiederholen', 
            validators = [
                validators.Required(), 
                validators.EqualTo("email")])
    password = PasswordField('Passwort:', 
            validators = [validators.Required()])
    password_confirm = PasswordField('Passwort wiederholen',
            validators = [validators.EqualTo("password")])
    #recaptcha = RecaptchaField()

    def validate_email(form, field):
        user = User.query.filter(User.email == field.data).first()
        if user is not None:
                raise validators.ValidationError("A user with that email already exists")


