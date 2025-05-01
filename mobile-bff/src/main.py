from rest_api import app
from urllib.parse import urlparse
from modules.config import BASE_URL

url = urlparse(BASE_URL)

if __name__ == "__main__":
    app.run(host=url.hostname, port=url.port, debug=True)
