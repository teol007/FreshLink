from flask_restx import Namespace, Resource, fields
from flask import jsonify, request
import requests
from modules.clients.orderProductsService.orderProductsRabbitMQ import publish_to_queue_order_products_service
from modules.clients.productsOfferingService.productsOfferingGrpc import products_grpc_client
from modules.middleware.authorization import authorize_roles, UserRole
from modules.config import MANAGE_USERS_BASE_URL, ORDER_PRODUCTS_REST_BASE_URL
from google.protobuf.json_format import MessageToDict

api = Namespace('Orders')

location_model = api.model('Location', {
    'place': fields.String(description='Location address'),
    'postCode': fields.String(description='Postal code'),
    'country': fields.String(description='Country')
})

farmer_model = api.model('Farmer', {
    '_id': fields.String(description='Farmer ID'),
    'email': fields.String(description='Farmer\'s email address'),
    'farmName': fields.String(description='Farm name'),
    'description': fields.String(description='Farm description'),
    'name': fields.String(description='Farmer\'s first name'),
    'surname': fields.String(description='Farmer\'s surname'),
    'location': fields.Nested(location_model, description='Farmer\'s location')
})

restaurant_model = api.model('Restaurant', {
    '_id': fields.String(description='Restaurant ID', required=True),
    'email': fields.String(description='Restaurant email', required=True),
    'name': fields.String(description='Restaurant name', required=True),
    'description': fields.String(description='Restaurant description'),
    'location': fields.Nested(location_model, description='Restaurant\'s location'),
    'phoneNumber': fields.String(description='Restaurant phone number'),
    'rating': fields.Float(description='Restaurant rating')
})

product_model = api.model('Product', {
    'id': fields.String(description='Product ID', required=True),
    'name': fields.String(description='Product Name', required=True),
    'description': fields.String(description='Product Description'),
    'price': fields.Float(description='Product Price', required=True),
    'quantity': fields.Float(description='Available Quantity of Product'),
    'unit': fields.String(description='Unit of Measurement (e.g., kg, lb)', required=True),
    'category': fields.String(description='Product Category', required=True),
    'farmerId': fields.String(description='ID of the Farmer', required=True),
    'farmerName': fields.String(description='Name of the Farmer', required=True),
})

product_wrapper_model = api.model('ProductWrapper', {
    'product_id': fields.String(description='Product ID from the order', required=True),
    'quantity': fields.Float(description='Quantity of Product Ordered', required=True),
    'product': fields.Nested(product_model, description='Product Details')
})

order_model = api.model('Order', {
    'order_id': fields.String(description='Order ID'),
    'farmer_id': fields.String(description='Farmer ID'),
    'restaurant_id': fields.String(description='Restaurant ID'),
    'products': fields.List(fields.Nested(product_wrapper_model)),
    'farmer': fields.Nested(farmer_model),
    'restaurant': fields.Nested(restaurant_model)
})

orders_rest_url = f"{ORDER_PRODUCTS_REST_BASE_URL}/orders"

@api.route('/')
class AllOrdersInfo(Resource):
    @api.response(200, 'Successful response', model=order_model, as_list=True)
    @api.response(503, 'Service unavailable')
    @authorize_roles([UserRole.ADMIN, UserRole.FARMER, UserRole.RESTAURANT])
    def get(self):
        """Get all orders"""
        print("GET /orders/ endpoint was called")

        try:
            users_base_url = f"{MANAGE_USERS_BASE_URL}"

            orders_response = requests.get(orders_rest_url, headers={"Authorization": request.headers.get("Authorization", "")})
            farmer_response = requests.get(f"{users_base_url}/farmers", headers={"Authorization": request.headers.get("Authorization", "")})
            restaurant_response = requests.get(f"{users_base_url}/restaurants", headers={"Authorization": request.headers.get("Authorization", "")})

            try:
                products_response = products_grpc_client.get_all_products()
            except Exception as err:
                print(f"gRPC Error: {err}")
                return {"message": "Could not get data from other service!"}, 503

            if not orders_response.ok or not farmer_response.ok or not restaurant_response.ok or products_response is None:
                return {"message": "Could not get data from other services."}, 503

            orders_json = orders_response.json()
            farmers_json = farmer_response.json()
            restaurant_json = restaurant_response.json()

            orders_with_more_info = []
            for order in orders_json:
                farmer = next((farmer for farmer in farmers_json if farmer['_id'] == order['farmer_id']), None)
                restaurant = next((restaurant for restaurant in restaurant_json if restaurant['_id'] == order['restaurant_id']), None)

                for order_product in order.get('products', []):
                    for pfr in products_response:
                        product_dict = MessageToDict(pfr, preserving_proto_field_name=True)
                        if product_dict['id'] == order_product['product_id']:
                            order_product['product'] = product_dict
                            break
                
                orders_with_more_info.append({
                    **order,
                    'farmer': farmer,
                    'restaurant': restaurant
                })

            return orders_with_more_info, 200

        except Exception as e:
            print(f"Error: {e}")
            return {"message": "Internal Server Error"}, 500
