import os
from dotenv import load_dotenv
load_dotenv()

# JWT
SECRET = os.getenv('SECRET')
ALGORITHM = os.getenv('ALGORITHM')

# Database
DB_HOST =  os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PWD = os.getenv('DB_PWD')
DB_DBNAME = os.getenv('DB_DBNAME')

# API
API_PORT = int(os.getenv('API_PORT'))