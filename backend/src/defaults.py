from auth.auth0_service import Auth0Service
from auth.auth_service import AuthService
from models.database_handler import PsycopgDatabaseHandler
from utilities import constants


auth_service: AuthService = Auth0Service()


settings = {
    'host': constants.DB_HOST,
    'port': constants.DB_PORT,
    'user': constants.DB_USER,
    'password': constants.DB_PWD,
    'database': constants.DB_DBNAME
}

db_handler = PsycopgDatabaseHandler(**settings)
