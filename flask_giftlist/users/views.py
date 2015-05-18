from flask import Blueprint, render_template, flash, redirect, url_for, request
from flask.ext.login import login_required, login_user, logout_user

from .forms import LoginForm, RegistrationForm
from .models import User


users = Blueprint('users', __name__)


@users.route('/login/', methods=('GET', 'POST'))
def login():
    login_form = LoginForm()
    if login_form.validate_on_submit():
        login_user(login_form.user)
        flash("Logged in successfully.")
        return redirect(request.args.get("next") or url_for("giftlist_public.index"))
    return render_template("users/login.htm", form=login_form)

@users.route('/logout/')
@login_required
def logout():
    logout_user()
    return redirect(url_for('giftlist_public.index'))

@users.route('/register/', methods=('GET', 'POST'))
def register():
    reg_form = RegistrationForm()
    if reg_form.validate_on_submit():
        user_data = reg_form.data
        user_data.pop("email_confirm", None)
        user_data.pop("password_confirm", None)
        user = User.create(**user_data)
        login_user(user)
        return redirect(url_for('giftlist_public.index'))
    return render_template('users/register.htm', form = reg_form)

