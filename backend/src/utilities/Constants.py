import os
from dotenv import load_dotenv
load_dotenv()

MODE = os.getenv('MODE')

# API
API_HOST = os.getenv('API_HOST')
API_PORT = int(os.getenv('API_PORT'))

# JWT
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_AUDIENCE = os.getenv('AUTH0_AUDIENCE')
AUTH0_ALGORITHM = [os.getenv('AUTH0_ALGORITHM')]
AUTH0_CLAIM_NAMESPACE = os.getenv('AUTH0_CLAIM_NAMESPACE')

# Database
if MODE == 'production':
    DB_HOST =  os.getenv('PROD_DB_HOST')
    DB_PORT = os.getenv('PROD_DB_PORT')
    DB_USER = os.getenv('PROD_DB_USER')
    DB_PWD = os.getenv('PROD_DB_PWD')
    DB_DBNAME = os.getenv('PROD_DB_DBNAME')
else:
    DB_HOST =  os.getenv('DEV_DB_HOST')
    DB_PORT = os.getenv('DEV_DB_PORT')
    DB_USER = os.getenv('DEV_DB_USER')
    DB_PWD = os.getenv('DEV_DB_PWD')
    DB_DBNAME = os.getenv('DEV_DB_DBNAME')

# S3
S3_HOST = os.getenv('S3_HOST')
S3_PORT = os.getenv('S3_PORT')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')