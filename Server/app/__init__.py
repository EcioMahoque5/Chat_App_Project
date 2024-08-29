from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_wtf.csrf import CSRFProtect
from flask_socketio import SocketIO  # Import SocketIO

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
csrf = CSRFProtect()
socketio = SocketIO()  # Initialize SocketIO

def create_app():
    app = Flask(__name__)
    
    # Load environment variables from a .env file
    load_dotenv()
    
    # Load configurations
    app.config.from_object('app.config.Config')
    app.json.sort_keys = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    csrf.init_app(app)
    socketio.init_app(app)  # Initialize SocketIO with the app
    
    # Register blueprints
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
