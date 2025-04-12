import multiprocessing
import signal
import sys
from service.order_products_API import app as rest_api
from service.order_products_MQ import order_products_service as start_message_queue_service

def start_flask_service():
    rest_api.run(host='0.0.0.0', port=5000, debug=True)

def start_rabbitmq_service():
    start_message_queue_service()

def signal_handler(sig, frame):
    print('Shutting down gracefully...')
    sys.exit(0)


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    
    flask_process = multiprocessing.Process(target=start_flask_service)
    flask_process.start()

    rabbitmq_process = multiprocessing.Process(target=start_rabbitmq_service)
    rabbitmq_process.start()

    flask_process.join()
    rabbitmq_process.join()
