from flask import request
from flask_restx import Namespace, Resource, fields
import requests
from requests.exceptions import RequestException
from modules.config import MANAGE_USERS_BASE_URL
from modules.middleware.authorization import authorize_roles, UserRole

api = Namespace('Users')

farmer_login_model = api.model('FarmerLoginRequest', {
    'email': fields.String(required=True, example="john.doe@example.com"),
    'password': fields.String(required=True, example="password123")
})

restaurant_login_model = api.model('RestaurantLoginRequest', {
    'email': fields.String(required=True, example="evala@example.com"),
    'password': fields.String(required=True, example="pass123")
})

# Swagger model for error response
error_model = api.model('Error', {
    'message': fields.String
})

@api.route('/')
class AllUsers(Resource):
    @api.doc(security='Bearer Auth',
             responses={
                 200: 'Successful response',
                 503: 'Could not get data from other services',
                 500: 'Internal Server Error'
             })
    @authorize_roles([UserRole.ADMIN, UserRole.FARMER, UserRole.RESTAURANT])
    def get(self):
        """Get all farmers and restaurants"""
        print("GET /users/ endpoint was called")

        headers = {
            "Content-Type": "application/json",
            "Authorization": request.headers.get("Authorization", "")
        }

        try:
            farmer_response = requests.get(f"{MANAGE_USERS_BASE_URL}/farmers", headers=headers)
            restaurant_response = requests.get(f"{MANAGE_USERS_BASE_URL}/restaurants", headers=headers)

            if not farmer_response.ok or not restaurant_response.ok:
                return {"message": "Could not get data from other services"}, 503

            return {
                "farmers": farmer_response.json(),
                "restaurants": restaurant_response.json()
            }, 200

        except Exception as e:
            print(f"Error: {e}")
            return {"message": "Internal Server Error"}, 500

@api.route('/farmers/login')
class FarmerLogin(Resource):
    @api.expect(farmer_login_model, validate=True)
    @api.response(200, 'Farmer logged in successfully')
    @api.response(401, 'Invalid email or password', model=error_model)
    @api.response(422, 'Missing required properties', model=error_model)
    @api.response(503, 'User service unavailable', model=error_model)
    @api.doc(summary="Login a farmer",
             description="Authenticates a farmer and returns a JWT token and farmer details")
    def post(self):
        """Farmer login endpoint"""
        print("POST /users/farmers/login endpoint was called")
        try:
            response = requests.post(
                f"{MANAGE_USERS_BASE_URL}/farmers/login",
                json=request.get_json(),
                headers={"Content-Type": "application/json"}
            )

            return response.json(), response.status_code
        except RequestException as e:
            return {"message": "User service unavailable"}, 503
        except Exception as e:
            print(f"Error: {e}")
            return {"message": "Internal Server Error"}, 500

@api.route('/restaurants/login')
class RestaurantLogin(Resource):
    @api.expect(restaurant_login_model, validate=True)
    @api.response(200, 'Restaurant logged in successfully')
    @api.response(401, 'Invalid email or password', model=error_model)
    @api.response(422, 'Missing required properties', model=error_model)
    @api.response(503, 'User service unavailable', model=error_model)
    @api.doc(summary="Login a restaurant",
             description="Authenticates a restaurant and returns a JWT token and restaurant details")
    def post(self):
        """Restaurant login endpoint"""
        print("POST /users/restaurants/login endpoint was called")
        try:
            response = requests.post(
                f"{MANAGE_USERS_BASE_URL}/restaurants/login",
                json=request.get_json(),
                headers={"Content-Type": "application/json"}
            )

            return response.json(), response.status_code
        except RequestException as e:
            return {"message": "User service unavailable"}, 503
        except Exception as e:
            print(f"Error: {e}")
            return {"message": "Internal Server Error"}, 500
