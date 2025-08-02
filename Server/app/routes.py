from flask import Blueprint, request, jsonify
from app.models import db, Users, LoginAttempt, Messages
from app.validators import RegistrationForm, LoginForm
from flask_jwt_extended import create_access_token, decode_token
from flask_wtf.csrf import generate_csrf
from app.decorators import jwt_required

# Create Blueprint
api_bp = Blueprint('api', __name__)

# CSRF Token Injection
@api_bp.after_request
def inject_csrf_token(response):
    response.headers.set('X-CSRFToken', generate_csrf())
    return response

@api_bp.route('/get_csrf_token', methods=['GET'])
def get_csrf_token():
    token = generate_csrf()
    response = jsonify({"csrf_token": token})
    response.headers.set("X-CSRFToken", token)
    return response, 200

"""
===================================================================================
                        AUTHENTICATION APIs
===================================================================================
"""
@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    form = LoginForm(data=data)

    if form.validate():
        user = Users.query.filter_by(username=form.username.data).first()

        if user and user.check_password(form.password.data):
            access_token = create_access_token(identity=str(user.id))

            db.session.add(LoginAttempt(username=form.username.data, success=True))
            db.session.commit()

            response = {
                "success": True,
                "message": f"Welcome back {user.first_name} {user.other_names}!",
                "access_token": access_token,
                "user": {
                    "first_name": user.first_name,
                    "other_names": user.other_names,
                    "user_id": user.id
                },
                "cod": 200
            }
            return jsonify(response), 200
        
        db.session.add(LoginAttempt(username=form.username.data, success=False))
        db.session.commit()

        response = {
            "success": False,
            "message": "Invalid credentials",
            "cod": 200
        }
        return jsonify(response), 200
    
    response = {
        "success": False,
        "message": "Validation errors",
        "errors": form.errors,
        "cod": 400
    }
    return jsonify(response), 400

"""
===================================================================================
                                    CRUD APIs
===================================================================================
"""
@api_bp.route('/create_user', methods=['POST'])
def register():
    data = request.get_json()
    form = RegistrationForm(data=data)

    if form.validate():
        new_user = Users(
            first_name=form.first_name.data,
            other_names=form.other_names.data,
            username=form.username.data
        )
        new_user.set_password(form.password.data)
        db.session.add(new_user)
        db.session.commit()

        response = {
            "success": True,
            "message": "Users successfully registered",
            "data": new_user.to_dict(),
            "cod": 201
        }
        return jsonify(response), 201
    
    response = {
        "success": False,
        "message": "Validation errors",
        "error": form.errors,
        "cod": 400
    }
    return jsonify(response), 400


@api_bp.route('/messages', methods=['POST'])
@jwt_required
def get_messages(current_user):
    try:
        data = request.get_json()
        chat_room = data.get('chat_room') 
        
        if not chat_room:
            return jsonify({
                "success": False,
                "message": "Chat room not specified",
                "cod": 400
            }), 400
        
        messages = Messages.query.filter_by(chat_room=chat_room).order_by(Messages.timestamp.asc()).all()
        messages_2 = [msg.to_dict() for msg in messages]
        response = {
            "success": False,
            "message": "Messages retrieved",
            "data": messages_2,
            "code": 200
        } 
        
        return jsonify(response), 200
    
    except Exception as e:
        response = {
            "success": False,
            "message": "Failed to fetch messages",
            "error": str(e),
            "code": 500
        }
        return jsonify(response), 500


@api_bp.route('/get_all_users', methods=['GET'])
@jwt_required
def get_all_users(current_user):
    try:
        users = Users.query.all()
        response = {
            "success": True,
            "message": "Users found",
            "data": [user.to_dict() for user in users],
            "cod": 200
        }
        return jsonify(response), 200
    
    except Exception as e:
        response = {
            "success": False,
            "message": "Failed to fetch users",
            "error": str(e),
            "cod": 500
        }
        return jsonify(response), 500
