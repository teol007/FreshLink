import pytest
from flask_testing import TestCase
from dao.orderDao import OrderDao
from service.order_products_API import app
from bson import ObjectId
import json

from vao.order import Order

class TestOrderAPI(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        return app

    def setUp(self):
        self.dao = OrderDao()
        self.dao.collection.drop()

        self.sample_order = {
            "_id": str(ObjectId()),
            "restaurant_id": "restaurant123",
            "farmer_id": "farmer456",
            "products": [
                {"product_id": "prod001", "quantity": 10},
                {"product_id": "prod002", "quantity": 5}
            ]
        }
        self.dao.create(Order.from_dict(self.sample_order))

    def tearDown(self):
        # Clean up after each test if needed
        self.dao.collection.drop()

    def test_get_all_orders(self):
        """Test the get all orders endpoint"""
        response = self.client.get('/orders')
        self.assertEqual(response.status_code, 200)
        
        orders = json.loads(response.data)
        self.assertGreater(len(orders), 0)  # Ensure there's at least one order

        self.assertEqual(orders[0]['_id'], self.sample_order["_id"])
        self.assertEqual(orders[0]['restaurant_id'], self.sample_order['restaurant_id'])
        self.assertEqual(orders[0]['farmer_id'], self.sample_order['farmer_id'])
        self.assertEqual(orders[0]['products'], self.sample_order['products'])

    def test_get_order_valid_id(self):
        """Test the get order by ID endpoint with a valid ID"""
        order_id = self.sample_order["_id"]
        response = self.client.get(f'/orders/{order_id}')
        self.assertEqual(response.status_code, 200)
        
        order = json.loads(response.data)
        self.assertEqual(order['_id'], self.sample_order["_id"])
        self.assertEqual(order['restaurant_id'], self.sample_order['restaurant_id'])
        self.assertEqual(order['farmer_id'], self.sample_order['farmer_id'])
        self.assertEqual(order['products'], self.sample_order['products'])

    def test_get_order_invalid_id(self):
        """Test the get order by ID endpoint with an invalid ID"""
        response = self.client.get('/orders/invalid_order_id')
        self.assertEqual(response.status_code, 400)
        
        error = json.loads(response.data)
        self.assertEqual(error['error'], 'Invalid order ID format')

    def test_get_order_not_found(self):
        """Test the get order by ID endpoint with a non-existing ID"""
        order_id = str(ObjectId())  # ID that doesn't exist
        response = self.client.get(f'/orders/{order_id}')
        self.assertEqual(response.status_code, 404)
        
        error = json.loads(response.data)
        self.assertEqual(error['error'], 'Order not found')

if __name__ == '__main__':
    pytest.main()
