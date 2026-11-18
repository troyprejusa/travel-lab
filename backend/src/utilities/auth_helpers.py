
from defaults import db_handler
from .utilities_logger import utilities_logger


async def establish_user_attendance(email: str) -> dict:
    try:
        trip_data = {}

        user_trips = await db_handler.get_user_trip_attendance(email)

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
