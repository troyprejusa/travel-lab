from auth.auth_service import AuthService
from auth.auth_service_factory import create_auth_service
from models.sqlalchemy_database_handler import SQLAlchemyDatabaseHandler
from utilities import constants


auth_service: AuthService = create_auth_service()


settings = {
    'host': constants.DB_HOST,
    'port': constants.DB_PORT,
    'user': constants.DB_USER,
    'password': constants.DB_PWD,
    'database': constants.DB_DBNAME
}

db_handler = SQLAlchemyDatabaseHandler(**settings)
