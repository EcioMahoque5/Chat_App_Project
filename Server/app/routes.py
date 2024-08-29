from flask import Blueprint, request, jsonify
from .models import db, User, LoginAttempt
from .forms import RegistrationForm, LoginForm, UpdateUserForm
from flask_jwt_extended import jwt_required, create_access_token
from flask_wtf.csrf import generate_csrf

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
        user = User.query.filter_by(username=form.username.data).first()

        if user and user.check_password(form.password.data):
            access_token = create_access_token(identity=user.id)

            db.session.add(LoginAttempt(username=form.username.data, success=True))
            db.session.commit()

            response = {
                "success": True,
                "message": f"Welcome back {user.first_name} {user.other_names}!",
                "access_token": access_token,
                "cod": 200
            }
            return jsonify(response), 200
        
        db.session.add(LoginAttempt(username=form.username.data, success=False))
        db.session.commit()

        response = {
            "success": False,
            "message": "Invalid credentials",
            "cod": 401
        }
        return jsonify(response), 401
    
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
        new_user = User(
            first_name=form.first_name.data,
            other_names=form.other_names.data,
            username=form.username.data
        )
        new_user.set_password(form.password.data)
        db.session.add(new_user)
        db.session.commit()

        response = {
            "success": True,
            "message": "User successfully registered",
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

@api_bp.route('/get_all_users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        users = User.query.all()
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
