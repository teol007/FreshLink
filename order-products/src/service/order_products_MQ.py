import pika
import json
from vao.order import Order
from dao.orderDao import OrderDao
import os
from dotenv import load_dotenv

load_dotenv()

testing = os.getenv('TESTING', 'false')
message_queue_url = os.getenv('OPS_MESSAGE_QUEUE_URL', None)
if(testing.lower() != 'true' and message_queue_url is None):
    raise ValueError("Enviroment variable OPS_MESSAGE_QUEUE_URL is not set.")

def handle_message(message):
    action = message.get("action")
    dao = OrderDao()
    
    if action == "create":
        order_data = message.get("order")
        if order_data:
            order = Order.from_dict(order_data)
            dao.create(order)
            print(f"Order created: {order._id}")

    elif action == "update":
        order_data = message.get("order")
        if order_data and order_data.get("_id"):
            order = Order.from_dict(order_data)
            if order:
                dao.update(order)
                print(f"Order updated: {order._id}")
            else:
                print(f"Order with ID {order_data['_id']} not found.")
        else:
            print("Invalid order data for update.")

    elif action == "delete":
        order_id = message.get("order_id")
        if order_id:
            dao.delete(order_id)
            print(f"Order deleted: {order_id}")
        else:
            print("No order ID provided for deletion.")

    else:
        print("Invalid action in message:", action)

def order_products_service():
    connection = pika.BlockingConnection(pika.ConnectionParameters(message_queue_url))
    channel = connection.channel()
    
    queue_name = "orders"
    channel.queue_declare(queue=queue_name)

    def callback(ch, method, properties, body):
        try:
            message = json.loads(body.decode("utf-8"))
            handle_message(message)
        except Exception as e:
            print(f"Error processing message: {e}")

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

    print("Waiting for messages...")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Shutting down...")
        channel.stop_consuming()

    connection.close()
