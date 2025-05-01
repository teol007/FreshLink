import os
from dotenv import load_dotenv

load_dotenv()

def get_env_variable(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise EnvironmentError(f"Environment variable {name} not set.")
    return value

BASE_URL = get_env_variable("MBFF_BASE_URL")
MANAGE_USERS_BASE_URL = get_env_variable("MBFF_MANAGE_USERS_SERVICE_BASE_URL")
PRODUCTS_OFFERING_BASE_URL = get_env_variable("MBFF_PRODUCTS_OFFERING_SERVICE_BASE_URL")
ORDER_PRODUCTS_REST_BASE_URL = get_env_variable("MBFF_ORDER_PRODUCTS_SERVICE_REST_BASE_URL")
ORDER_PRODUCTS_MSQUEUE_BASE_URL = get_env_variable("MBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_URL")
ORDER_PRODUCTS_MSQUEUE_NAME = get_env_variable("MBFF_ORDER_PRODUCTS_SERVICE_MSQUEUE_NAME")
