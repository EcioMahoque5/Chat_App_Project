from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150), nullable=False)
    other_names = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    messages = db.relationship('Message', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict_full(self):
        return {
            'id': self.id,
            'name': f"{self.first_name} {self.other_names}",
            'username': self.username,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'other_names': self.other_names,
            'username': self.username,
            'created_at': self.created_at
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_room  = db.Column(db.String(150), nullable=False)  # Allow multiple messages in one room
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.now)

    
    def __repr__(self):
        return f'<Message {self.room} by {self.user_id}>'
    
    def to_dict(self):
        user = User.query.get_or_404(self.user_id)
        return{
            'user_id': self.user_id,
            'user': f"{user.first_name} {user.other_names}",
            'content': self.content,
            'timestamp': self.timestamp.isoformat()

        }

class LoginAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False)
    success = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
