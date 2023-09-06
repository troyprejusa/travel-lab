import os
from dotenv import load_dotenv
load_dotenv()

# JWT
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_AUDIENCE = os.getenv('AUTH0_AUDIENCE')
AUTH0_ALGORITHM = [os.getenv('AUTH0_ALGORITHM')]
AUTH0_CLAIM_NAMESPACE = os.getenv('AUTH0_CLAIM_NAMESPACE')

# Database
DB_HOST =  os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PWD = os.getenv('DB_PWD')
DB_DBNAME = os.getenv('DB_DBNAME')

# API
API_PORT = int(os.getenv('API_PORT'))

# S3
S3_HOST = os.getenv('S3_HOST')
S3_PORT = os.getenv('S3_PORT')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')