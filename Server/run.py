from app import create_app, socketio

app = create_app()

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(msg):
    print('Message received:', msg)
    socketio.emit('message', msg, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5000)
