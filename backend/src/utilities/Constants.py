import os
from dotenv import load_dotenv
load_dotenv()

MODE = os.getenv('MODE')

# API
API_HOST = os.getenv('API_HOST')
API_PORT = int(os.getenv('API_PORT'))
API_REQUEST_COUNT = int(os.getenv('API_REQUEST_COUNT'))
API_REQUESTS_WINDOW = int(os.getenv('API_REQUESTS_WINDOW'))

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

# Database limits
LIMIT_TRIPS_CREATED_PER_USER = int(os.getenv('LIMIT_TRIPS_CREATED_PER_USER'))   # protects trip table
LIMIT_TRIPS_ATTENDED_PER_USER = int(os.getenv('LIMIT_TRIPS_ATTENDED_PER_USER'))     # Junction: protects traveller_trip table
LIMIT_TRAVELLERS_PER_TRIP = int(os.getenv('LIMIT_TRAVELLERS_PER_TRIP'))     # Junction: protects traveller_trip table
LIMIT_ITINERARY_PER_TRIP = int(os.getenv('LIMIT_ITINERARY_PER_TRIP'))   # protects itinerary table
LIMIT_POLLS_PER_TRIP = int(os.getenv('LIMIT_POLLS_PER_TRIP'))    # protects polls tables
LIMIT_PACKING_PER_TRIP = int(os.getenv('LIMIT_PACKING_PER_TRIP'))   # protects packing table
LIMIT_MESSAGES_PER_TRIP = int(os.getenv('LIMIT_MESSAGES_PER_TRIP'))     # protects messages table

# S3
S3_HOST = os.getenv('S3_HOST')
S3_PORT = os.getenv('S3_PORT')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')