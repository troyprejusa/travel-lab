import os
from dotenv import load_dotenv
load_dotenv()

MODE = os.getenv('MODE')

# API
API_HOST = os.getenv('API_HOST')
API_PORT = int(os.getenv('API_PORT'))

# JWT
SECRET = os.getenv('SECRET')
ALGORITHM = os.getenv('ALGORITHM')

# Database
DB_HOST =  os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PWD = os.getenv('DB_PWD')
DB_DBNAME = os.getenv('DB_DBNAME')

# S3
S3_HOST = os.getenv('S3_HOST')
S3_PORT = os.getenv('S3_PORT')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')