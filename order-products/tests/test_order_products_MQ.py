import unittest
from unittest.mock import patch
from service.order_products_MQ import handle_message
from dao.orderDao import OrderDao
from bson import ObjectId

class TestMQCreateAction(unittest.TestCase):
    _id = ObjectId()
    message_create = {
        "action": "create",
        "order": {
            "_id": _id,
            "restaurant_id": "r123",
            "farmer_id": "f456",
            "products": [
                {"product_id": "p1", "quantity": 2.0},
                {"product_id": "p2", "quantity": 1.5}
            ]
        }
    }
    message_update = {
        "action": "update",
        "order": {
            "_id": _id,
            "restaurant_id": "r12345",
            "farmer_id": "f45678",
            "products": [
                {"product_id": "p1", "quantity": 5.0},
                {"product_id": "p2", "quantity": 1.54}
            ]
        }
    }
    message_delete = {
        "action": "delete",
        "order_id": _id
    }
    
    def test_create_order(self):
        dao = OrderDao()
        dao.collection.delete_many({})

        handle_message(self.message_create)

        orders = dao.get_all()
        self.assertEqual(len(orders), 1)
        
        order = orders[0].to_dict()
        self.assertEqual(order["_id"], self.message_create["order"]["_id"])
        self.assertEqual(order["restaurant_id"], self.message_create["order"]["restaurant_id"])
        self.assertEqual(order["farmer_id"], self.message_create["order"]["farmer_id"])
        self.assertEqual(order["products"], self.message_create["order"]["products"])
        
        
    def test_update_order(self):
        dao = OrderDao()
        dao.collection.delete_many({})

        handle_message(self.message_create)
        handle_message(self.message_update)

        orders = dao.get_all()
        self.assertEqual(len(orders), 1)
        
        order = orders[0].to_dict()
        self.assertEqual(order["_id"], self.message_update["order"]["_id"])
        self.assertEqual(order["restaurant_id"], self.message_update["order"]["restaurant_id"])
        self.assertEqual(order["farmer_id"], self.message_update["order"]["farmer_id"])
        self.assertEqual(order["products"], self.message_update["order"]["products"])
        
    def test_delete_order(self):
        dao = OrderDao()
        dao.collection.delete_many({})

        handle_message(self.message_create)
        handle_message(self.message_delete)

        orders = dao.get_all()
        self.assertEqual(len(orders), 0)

if __name__ == "__main__":
    unittest.main()
