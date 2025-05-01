import requests
from functools import wraps
from flask import request, jsonify
from flask_restx import abort
from modules.config import MANAGE_USERS_BASE_URL
from enum import Enum

class UserRole(str, Enum):
    FARMER = "farmer"
    RESTAURANT = "restaurant"
    ADMIN = "admin"
    UNSPECIFIED = "unspecified"

AUTHENTICATE_URL = f"{MANAGE_USERS_BASE_URL}/tokens/authenticate"

def authorize_roles(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            token = auth_header.split(" ")[1] if auth_header.lower().startswith("bearer ") else auth_header
            if not token:
                print("No valid token found in authorization header")
                abort(401, message="No token provided")

            try:
                response = requests.post(
                    AUTHENTICATE_URL,
                    json={"token": token},
                    headers={"Content-Type": "application/json"}
                )
            except requests.RequestException as e:
                abort(503, message="Authentication service unavailable")

            if response.status_code != 200:
                return response.json(), response.status_code

            data = response.json()
            user_role = data.get("role")
            if not user_role:
                abort(401, message="Cannot parse JWT payload")

            if user_role not in allowed_roles:
                abort(403, message="Your role does not have access")

            request.user_role = user_role
            return fn(*args, **kwargs)
        return wrapper
    return decorator
