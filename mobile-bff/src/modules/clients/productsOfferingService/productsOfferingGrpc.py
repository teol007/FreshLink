import grpc
from modules.clients.productsOfferingService import productsOffering_pb2
from modules.clients.productsOfferingService import productsOffering_pb2_grpc

from modules.config import PRODUCTS_OFFERING_BASE_URL

class ProductsClient:
    def __init__(self, channel):
        self.stub = productsOffering_pb2_grpc.ProductsOfferingServiceStub(channel)

    def get_all_products(self):
        try:
            request = productsOffering_pb2.Empty()
            response = self.stub.getAllProducts(request)
            return response.products
        except grpc.RpcError as e:
            print(f"Error calling gRPC service: {e}")
            return None

channel = grpc.insecure_channel(PRODUCTS_OFFERING_BASE_URL)

products_grpc_client = ProductsClient(channel)
