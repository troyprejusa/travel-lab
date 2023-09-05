
from fastapi.responses import JSONResponse
from utilities import Constants
from models.DatabaseHandler import db_handler
import jwt
from jwt import PyJWKClient
from utilities import Constants


# Global variable
key_cache = {}

async def jwt_decode_w_retry(token: str) -> dict:
    key_id = jwt.get_unverified_header(token)['kid']

    payload = {}

    if key_id in key_cache:
        try:
            rsa_key = key_cache[key_id]
            payload = decode_jwt(token, rsa_key)
        except jwt.exceptions.InvalidTokenError:
            # Retry with updated keys
            rsa_key = await get_rsa_keys(key_id)
            payload = decode_jwt(token, rsa_key)

    else:
        rsa_key = await get_rsa_keys(key_id)
        payload = decode_jwt(token, rsa_key)

    print(payload)

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
   

def create_jwt(user: dict) -> str:
    try:
        user_data = user.copy()
        user_data['trips'] = []

        user_trips = db_handler.query("""
            SELECT trip_id, admin FROM traveller_trip WHERE traveller_id=%s AND confirmed=TRUE;
        """, (user['id'],))

        for trip in user_trips:
            user_data['trips'].append(trip)
        # print(user_data)

        encoded_jwt = jwt.encode(user_data, Constants.SECRET, algorithm = Constants.ALGORITHM)

        return encoded_jwt
    
    except Exception as error:
        print('Unable to create JWT\n', str(error))
        raise error


def verify_attendance(trip_id, trips) -> None:
    for trip in trips:
        if trip['trip_id'] == trip_id:
            return

    raise Exception('User not authorized for this trip')


def verify_admin(trip_id, trips) -> None:
    for trip in trips:
        if trip['trip_id'] == trip_id and trip['admin'] == True:
            return
        
    raise Exception('User is not an admin on this trip')
