
from . import Constants
from models.DatabaseHandler import db_handler
import jwt
from jwt import PyJWKClient
from auth0.authentication import GetToken
from auth0.management import Auth0
from .UtilitiesLogger import utilities_logger


# Global variable
key_cache = {}

async def jwt_decode_w_retry(token: str) -> dict:
    payload = {}
    key_id = jwt.get_unverified_header(token)['kid']
    if key_id in key_cache:
        try:
            rsa_key = key_cache[key_id]
            payload = decode_jwt(token, rsa_key)
        except jwt.exceptions.InvalidTokenError:
            # Retry with updated keys
            key_cache.pop(key_id)
            rsa_key = await get_rsa_keys(token)
            payload = decode_jwt(token, rsa_key)

    else:
        rsa_key = await get_rsa_keys(token)
        payload = decode_jwt(token, rsa_key)

    return payload


async def get_rsa_keys(token: str) -> dict:
    url = f"https://{Constants.AUTH0_DOMAIN}/.well-known/jwks.json"
    jwks_client = PyJWKClient(url)
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    rsa_key = signing_key.key
    
    # Add to global variable
    key_id = jwt.get_unverified_header(token)['kid']
    key_cache[key_id] = rsa_key

    # Return key as well, for convenience
    return rsa_key


def decode_jwt(token: str, rsa_key) -> dict:
    return jwt.decode(
    token,
    key=rsa_key,
    algorithms=Constants.AUTH0_ALGORITHM,
    audience=Constants.AUTH0_AUDIENCE,
    issuer=f"https://{Constants.AUTH0_DOMAIN}/",
    )
   

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
    get_token = GetToken(Constants.AUTH0_DOMAIN, Constants.AUTH0_CLIENT_ID, client_secret=Constants.AUTH0_CLIENT_SECRET)
    token = get_token.client_credentials(f'https://{Constants.AUTH0_DOMAIN}/api/v2/')
    mgmt_api_token = token['access_token']
    auth0 = Auth0(Constants.AUTH0_DOMAIN, mgmt_api_token)

    return auth0
