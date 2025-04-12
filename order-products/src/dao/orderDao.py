from db import db
from vao.order import Order
from bson import ObjectId

class OrderDao:
    _instance = None

    def __new__(self):
        if self._instance is None:  #Create or get instance, because it is singleton
            self._instance = super(OrderDao, self).__new__(self)
            self._instance.collection = db["orders"]
        return self._instance
        
        
    def get_all(self) -> list[Order]:
        cursor = self.collection.find()
        return [Order.from_dict(doc) for doc in cursor]
    
    def get(self, order_id: str) -> Order | None:
        try:
            doc = self.collection.find_one({"_id": ObjectId(order_id)})
            return Order.from_dict(doc) if doc else None
        except Exception:
            return None
        
    def get_by_farmer(self, farmer_id: str) -> list[Order]:
        cursor = self.collection.find({"farmer_id": farmer_id})
        return [Order.from_dict(doc) for doc in cursor]

    def get_by_restaurant(self, restaurant_id: str) -> list[Order]:
        cursor = self.collection.find({"restaurant_id": restaurant_id})
        return [Order.from_dict(doc) for doc in cursor]

    def create(self, order: Order):
        if(order._id is None or order._id == ""):
            order._id = ObjectId()
        else:
            order._id = ObjectId(order._id)
            
        self.collection.insert_one(order.to_dict())

    def update(self, updated_order: Order):
        update_data = updated_order.to_dict()
        update_data.pop("_id", None)  # Removes _id field
        result = self.collection.update_one(
            {"_id": ObjectId(updated_order._id)},  # Match the order by its _id
            {"$set": update_data}
        )
        print(updated_order.restaurant_id)
        print(f"Matched count: {result.matched_count}, Modified count: {result.modified_count}")
        
    def delete(self, order_id: str):
        self.collection.delete_one({"_id": ObjectId(order_id)})
