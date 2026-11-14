"""Database connection settings shared by command-line tools."""
import os
from dotenv import load_dotenv
from sqlalchemy import URL

load_dotenv()


def database_url():
    prefix = 'PROD' if os.getenv('MODE', 'development') == 'production' else 'DEV'
    return URL.create('postgresql+psycopg', username=os.getenv(f'{prefix}_DB_USER'),
                      password=os.getenv(f'{prefix}_DB_PWD'), host=os.getenv(f'{prefix}_DB_HOST'),
                      port=int(os.getenv(f'{prefix}_DB_PORT', '5432')),
                      database=os.getenv(f'{prefix}_DB_DBNAME'))
