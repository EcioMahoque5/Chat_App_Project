from functools import wraps
from flask import request, make_response
from flask_jwt_extended import decode_token
from app.models import db, Users
from app.config import logger

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')

        if not token:
            return make_response({
                'success': False,
                'message': "Token is missing!",
                "code": 401
            }, 401)

        try:
            data = decode_token(token, csrf_value=None, allow_expired=False)

            username_or_id = data.get('sub') or data.get('id')

            current_user = db.session.query(Users).filter_by(id=username_or_id).first()

            if not current_user:
                return make_response({
                    'success': False,
                    'message': 'Invalid user token!',
                    'code': 401
                }, 401)

        except Exception as e:
            logger.error("Error occurred during token validation", exc_info=True)
            return make_response({
                "success": False,
                "message": "JWT token is missing or invalid!",
                "code": 500
            }, 500)

        return f(current_user, *args, **kwargs)

    return decorated
