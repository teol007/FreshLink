from flask import Flask, jsonify, request
from flask_restx import Api, Resource, fields, marshal
from bson import ObjectId
from dao.orderDao import OrderDao
import json

app = Flask(__name__)
api = Api(app, version='1.0', title='Order API',
          description='A simple Order API that allows management of orders')

# Define the Swagger model for the order data
order_model = api.model('Order', {
    '_id': fields.String(description='The order ID', required=True),
    'restaurant_id': fields.String(description='The restaurant ID', required=True),
    'farmer_id': fields.String(description='The farmer ID', required=True),
    'products': fields.List(fields.Nested(api.model('Product', {
        'product_id': fields.String(description='Product ID', required=True),
        'quantity': fields.Float(description='Product quantity', required=True)
    })), description='List of products in the order', required=True)
})

error_model = api.model('Error', {
    'error': fields.String(required=True, description='Error message'),
})

dao = OrderDao()

@api.route('/orders')
class OrderList(Resource):
    @api.doc('get_all_orders')
    @api.marshal_list_with(order_model)  # Swagger will use this model for the response
    def get(self):
        """Get all orders"""
        try:
            orders = dao.get_all()
            print("GET /orders")
            return orders, 200
        except Exception as e:
            print(e)
            return {"error": str(e)}, 500

@api.route('/orders/<string:id>')
class Order(Resource):
    @api.doc('get_order')
    @api.response(400, 'Invalid order ID format', error_model)
    @api.response(404, 'Order not found', error_model)
    @api.response(500, 'Internal server error', error_model)
    @api.response(200, 'Success', order_model)
    def get(self, id):
        """Get an order by ID"""
        try:
            if not ObjectId.is_valid(id):
                return {"error": "Invalid order ID format"}, 400
            
            order = dao.get(id)
            print(order)
            if order and order._id is not None:
                order._id = str(order._id)
                print(f"GET /orders/{id}")
                return order.to_dict(), 200
            else:
                return {"error": "Order not found"}, 404
        except Exception as e:
            print(e)
            return {"error": str(e)}, 500
