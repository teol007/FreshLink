import pika
import json
from modules.config import ORDER_PRODUCTS_MSQUEUE_BASE_URL, ORDER_PRODUCTS_MSQUEUE_NAME

# Initialize the channel
channel = None
queue_name = ORDER_PRODUCTS_MSQUEUE_NAME or "orders"

def connect_order_products_service_mq():
    global channel
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=ORDER_PRODUCTS_MSQUEUE_BASE_URL))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=False)

def publish_to_queue_order_products_service(message: dict):
    if channel is None:
        raise Exception('RabbitMQ channel is not initialized.')

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Persistent message
        )
    )
