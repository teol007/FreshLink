class Product:
    def __init__(self, product_id, quantity):
        self.product_id = product_id #Type: string
        self.quantity = quantity #Type: double

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "quantity": self.quantity
        }

    @staticmethod
    def from_dict(data):
        return Product(
            product_id=data["product_id"],
            quantity=data["quantity"]
        )
