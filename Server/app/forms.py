from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Length, Regexp, ValidationError, Optional
from .models import User

class RegistrationForm(FlaskForm):
    first_name = StringField('first_name', validators=[
        DataRequired(message="First Name is required!"),
        Length(min=3, max=150, message="First Name must be between 3 and 150 characters!")
    ])

    other_names = StringField('other_names', validators=[
        DataRequired(message="Other Names is required!"),
        Length(min=3, max=150, message="Other Names must be between 3 and 150 characters!")
    ])

    username = StringField('username', validators=[
        DataRequired(message="Username is required!"),
        Length(min=3, max=150, message="Username must be between 3 and 150 characters!")
    ])

    password = PasswordField('password', validators=[
        DataRequired(message="Password is required!"),
        Regexp(
            regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=]).{8,32}$',
            message='Password must include at least one uppercase letter, one lowercase letter, one number, and one special character, and be between 8 and 32 characters long'
        )
    ])

    def validate_username(self, field):
        if User.query.filter_by(username=field.data).first():
            raise ValidationError('Username is already registered.')

class LoginForm(FlaskForm):
    username = StringField('username', validators=[
        DataRequired(message="Username is required!"),
        Length(min=3, max=150, message="Username must be between 3 and 150 characters!")
    ])
    
    password = PasswordField('password', validators=[
        DataRequired(message="Password is required!")
    ])

    # Add this new field
    chatRoom = StringField('chatRoom', validators=[
        DataRequired(message="Chat room name is required!"),
        Length(min=1, max=150, message="Chat room name must be between 1 and 150 characters!")
    ])

class UpdateUserForm(FlaskForm):
    first_name = StringField('first_name', validators=[
        Optional(),
        Length(min=3, max=150, message="First Name must be between 3 and 150 characters!")
    ])

    other_names = StringField('other_names', validators=[
        Optional(),
        Length(min=3, max=150, message="Other Names must be between 3 and 150 characters!")
    ])

    username = StringField('username', validators=[
        Optional(),
        Length(min=3, max=150, message="Username must be between 3 and 150 characters!")
    ])

    password = PasswordField('password', validators=[
        Optional(),
        Regexp(
            regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=]).{8,32}$',
            message='Password must include at least one uppercase letter, one lowercase letter, one number, and one special character, and be between 8 and 32 characters long'
        )
    ])

    def validate_username(self, field):
        if field.data and User.query.filter_by(username=field.data).first():
            raise ValidationError('Username is already registered.')
