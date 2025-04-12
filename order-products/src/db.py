import mongomock
from pymongo import MongoClient
import os
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

testing = os.getenv('TESTING', 'false')
mongodb_url = os.getenv('OPS_MONGODB_URL', None)
if(testing.lower() != 'true' and mongodb_url is None):
    raise ValueError("Enviroment variable OPS_MONGODB_URL is not set.")

if testing.lower() == 'true':
    client = mongomock.MongoClient()  # In-memory MongoDB client
else:
    client = MongoClient(mongodb_url)

db = client["ita-order-products"]

try:
    client.admin.command('ping')
    print("Connected to MongoDB")
except ConnectionFailure:
    print("MongoDB connection failed")
