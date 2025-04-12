from vao.product import Product

class Order:
    def __init__(self, _id, restaurant_id, farmer_id, products):
        self._id = _id #Type: string
        self.restaurant_id = restaurant_id #Type: string
        self.farmer_id = farmer_id #Type: string
        self.products = products #Type: Product[]

    def to_dict(self):
        data = {
            "restaurant_id": self.restaurant_id,
            "farmer_id": self.farmer_id,
            "products": [p.to_dict() for p in self.products]
        }
        if self._id:
            data["_id"] = self._id  # Only add _id if it exists
        return data

    @staticmethod
    def from_dict(data):
        return Order(
            _id=data.get("_id"),
            restaurant_id=data["restaurant_id"],
            farmer_id=data["farmer_id"],
            products=[Product.from_dict(p) for p in data["products"]]
        )