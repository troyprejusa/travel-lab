
from fastapi.responses import JSONResponse
from utilities import Constants
from models.DatabaseHandler import db_handler
import jwt


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
