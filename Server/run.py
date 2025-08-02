
from app import create_app, socketio
from app.models import db, Messages, Users
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import JWTDecodeError
import datetime
from flask import request
from flask_socketio import join_room, leave_room
import logging

app = create_app()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

def log_message(message):
    separator = '\n' + '='*80 + '\n'
    logging.info(separator + message + separator)

@app.route('/')
def index():
    return "Chat Server is running"

@socketio.on('connect')
def handle_connect(auth):
    token = None

    token = auth.get('token') if auth else None

    if not token:
        return False 
    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub')  # <== Get identity from 'sub' claim
        if not user_id:
            raise ValueError("Missing 'sub' claim")

        user = Users.query.filter_by(id=user_id).first()
        if not user:
            raise ValueError("User not found")
        log_message(f"User {user_id} connected via Socket.IO")
    except JWTDecodeError as e:
        log_message(f"Connection rejected: {e}")
        return False  # Reject connection if token invalid

    client_ip = request.remote_addr
    log_message(f'Socket connected with IP: {client_ip}')

@socketio.on('disconnect')
def handle_disconnect():
    client_ip = request.remote_addr
    log_message(f'Client disconnected with IP: {client_ip}')


@socketio.on('message')
def handle_message(msg):
    log_message(f'Received message: {msg}')

    chat_room = msg.get('chatRoom')
    user_id = msg.get('user_id') 
    content = msg.get('message')
    
    if chat_room and user_id and content:
        # Save message to the database
        new_message = Messages(
            chat_room=chat_room,
            user_id=user_id,
            content=content,
            timestamp=datetime.datetime.now()
        )
        db.session.add(new_message)
        db.session.commit()
        
        socketio.emit('message', msg, room=chat_room)
        return {'success': True}
    else:
        # Fallback to broadcasting to all if no specific room is mentioned
        socketio.emit('message', msg, broadcast=True)
        log_message('Messages broadcasted to all rooms')
        return {'success': False, 'error': 'Missing chatRoom, user_id, or content'}


@socketio.on('join')
def handle_join(data):
    room = data.get('chatRoom')
    user = data.get('userFullName')
    if room:
        join_room(room)
        log_message(f'User {user} joined room: {room}')


@socketio.on('leave')
def handle_leave(data):
    room = data.get('chatRoom')
    user = data.get('userFullName')
    if room:
        leave_room(room)
        log_message(f'User {user} left room: {room}')


if __name__ == '__main__':
    socketio.run(app, port=5000)
