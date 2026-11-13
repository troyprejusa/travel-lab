
from . import constants
from models.database_handler import db_handler
from auth0.authentication import GetToken
from auth0.management import Auth0
from .utilities_logger import utilities_logger


async def establish_user_attendance(email: str) -> dict:
    try:
        trip_data = {}

        user_trips = await db_handler.query("""
            SELECT trip_id, admin FROM traveller_trip WHERE 
            traveller_id=(SELECT id FROM traveller WHERE email=%s) AND 
            confirmed=TRUE;
        """, (email,))

        # user_data.trips will be an object of objects, keyed by trip_id
        for trip in user_trips:
            trip_data[trip['trip_id']] = trip

        return trip_data
    
    except Exception as error:
        utilities_logger.error(f'Unable to gather trip data for {email}\n{error}')
        raise error


def verify_attendance(trip_id: str, trips: dict[str, dict[str, str]]) -> None:
    if trip_id in trips:
        return
    utilities_logger.warning('User attempted to affect trip they are not attending')
    raise Exception('User not attending this trip')


def verify_admin(trip_id: str, trips: dict[str, dict[str, str]]) -> None:
    if trip_id in trips and trips[trip_id]['admin'] == True:
        return
        
    raise Exception('verify_admin: User is not an admin on this trip')


def get_auth0_manager():
    get_token = GetToken(constants.AUTH0_DOMAIN, constants.AUTH0_CLIENT_ID, client_secret=constants.AUTH0_CLIENT_SECRET)
    token = get_token.client_credentials(f'https://{constants.AUTH0_DOMAIN}/api/v2/')
    mgmt_api_token = token['access_token']
    auth0 = Auth0(constants.AUTH0_DOMAIN, mgmt_api_token)

    return auth0
