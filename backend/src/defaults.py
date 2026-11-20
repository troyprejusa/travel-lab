from auth.auth_service import AuthService, AuthSettings
from auth.auth_service_factory import create_auth_service
from models.sqlalchemy_database_handler import SQLAlchemyDatabaseHandler
from settings import Settings
from utilities import environment


config = Settings(
    mode=environment.MODE,
    host=environment.HOST,
    api_request_count=environment.API_REQUEST_COUNT,
    api_requests_window=environment.API_REQUESTS_WINDOW,
    ws_request_count=environment.WS_REQUEST_COUNT,
    ws_request_window=environment.WS_REQUEST_WINDOW,
    db_host=environment.DB_HOST,
    db_port=environment.DB_PORT,
    db_user=environment.DB_USER,
    db_pwd=environment.DB_PWD,
    db_dbname=environment.DB_DBNAME,
    db_conn_limit=environment.DB_CONN_LIMIT,
    limit_total_users=environment.LIMIT_TOTAL_USERS,
    limit_trips_created_per_user=environment.LIMIT_TRIPS_CREATED_PER_USER,
    limit_trips_attended_per_user=environment.LIMIT_TRIPS_ATTENDED_PER_USER,
    limit_travellers_per_trip=environment.LIMIT_TRAVELLERS_PER_TRIP,
    limit_itinerary_per_trip=environment.LIMIT_ITINERARY_PER_TRIP,
    limit_polls_per_trip=environment.LIMIT_POLLS_PER_TRIP,
    limit_packing_per_trip=environment.LIMIT_PACKING_PER_TRIP,
    limit_messages_per_trip=environment.LIMIT_MESSAGES_PER_TRIP,
    auth_provider=environment.AUTH_PROVIDER,
    auth_config=AuthSettings(),
)


auth_service: AuthService = create_auth_service()


settings = {
    'host': environment.DB_HOST,
    'port': environment.DB_PORT,
    'user': environment.DB_USER,
    'password': environment.DB_PWD,
    'database': environment.DB_DBNAME
}

db_handler = SQLAlchemyDatabaseHandler(**settings)
