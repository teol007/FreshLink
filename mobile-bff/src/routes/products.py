from flask import Flask, jsonify, request
from flask_restx import Api, Namespace, Resource, fields
import grpc
import requests
from modules.clients.productsOfferingService.productsOfferingGrpc import products_grpc_client
from modules.config import MANAGE_USERS_BASE_URL
from modules.middleware.authorization import authorize_roles, UserRole
from google.protobuf.json_format import MessageToDict

api = Namespace('Products')

location_model = api.model('Location', {
    'place': fields.String(description='Farmer\'s location address'),
    'postCode': fields.String(description='Farmer\'s postal code'),
    'country': fields.String(description='Farmer\'s country'),
})

farmer_model = api.model('Farmer', {
    '_id': fields.String(description='Farmer ID'),
    'email': fields.String(description='Farmer\'s email address'),
    'farmName': fields.String(description='Farmer\'s farm name'),
    'description': fields.String(description='Description of the farm'),
    'name': fields.String(description='Farmer\'s first name'),
    'surname': fields.String(description='Farmer\'s surname'),
    'location': fields.Nested(location_model, description='Farmer\'s location details')
})

product_model = api.model('Product', {
    'id': fields.String(description='Product ID'),
    'name': fields.String(description='Product name'),
    'farmerId': fields.String(description='Farmer ID'),
    'farmer': fields.Nested(farmer_model, description='Farmer details')
})

@api.route('/')
class AllProductsInfo(Resource):
    @api.response(200, 'Successful response', model=product_model, as_list=True)
    @api.response(503, 'Service unavailable')
    @authorize_roles([UserRole.ADMIN, UserRole.FARMER, UserRole.RESTAURANT])
    def get(self):
        """Get all products"""
        print("GET /products/ endpoint was called")

        try:
            users_base_url = f"{MANAGE_USERS_BASE_URL}/farmers"
            farmer_response = requests.get(users_base_url, headers={"Authorization": request.headers.get("Authorization", "")})

            try:
                products_response = products_grpc_client.get_all_products()
            except grpc.RpcError as err:
                print(f"gRPC Error: {err}")
                return {"message": "Could not get data from other service!"}, 503

            if not farmer_response.ok or products_response is None:
                return {"message": "Could not get data from other services."}, 503

            farmers_json = farmer_response.json()

            products_with_more_info = []
            for product in products_response:
                product_dict = MessageToDict(product, preserving_proto_field_name=True)
                farmer = next((farmer for farmer in farmers_json if farmer['_id'] == product_dict.get('farmerId')), None)
                product_dict['farmer'] = farmer
                products_with_more_info.append(product_dict)


            return products_with_more_info, 200

        except Exception as e:
            print(f"Error: {e}")
            return {"message": "gRPC request failed"}, 500
