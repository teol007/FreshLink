from flask import Flask, jsonify, request
from flask_restx import Api, Resource, fields, marshal
from modules.middleware.authorization import authorize_roles
from modules.middleware.authorization import UserRole
from routes.users import api as users_route
from routes.products import api as products_route
from routes.orders import api as orders_route

app = Flask(__name__)
authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'JWT Authorization header using the Bearer scheme. Example: "Bearer {your_token}"'
    }
}
api = Api(app, version='1.0', title='Order API',
          description='A simple Order API that allows management of orders',
          authorizations=authorizations, security='Bearer Auth')
api.add_namespace(users_route, path='/users')
api.add_namespace(products_route, path='/products')
api.add_namespace(orders_route, path='/orders')
