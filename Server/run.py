
from app import create_app, socketio
from app.models import db, Message
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
def handle_connect():
    client_ip = request.remote_addr
    log_message(f'Client connected with IP: {client_ip}')

@socketio.on('disconnect')
def handle_disconnect():
    client_ip = request.remote_addr
    log_message(f'Client connected with IP: {client_ip}')


@socketio.on('message')
def handle_message(msg):
    log_message(f'Received message: {msg}')

    chat_room = msg.get('chatRoom')
    user_id = msg.get('user_id') 
    content = msg.get('message')
    
    if chat_room and user_id and content:
        # Save message to the database
        new_message = Message(
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
        log_message('Message broadcasted to all rooms')
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
