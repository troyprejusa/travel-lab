from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import TripModel, TravellerResponse, ItineraryModel, MessageModel, NewPollWS, PollResponse, PackingModel
from typing import Annotated
from datetime import date, datetime
from utilities.auth_helpers import verify_attendance, verify_admin
# from models.S3Handler import minio_client


trip_router = APIRouter(
    prefix='/trip'
)

# --------------- TRIP OPERATIONS --------------- #

@trip_router.post('/')
async def create_trip(
    request: Request,
    destination: Annotated[str, Form()],
    description: Annotated[str, Form()],
    start_date: Annotated[date, Form()],
    end_date: Annotated[date, Form()]
    ) -> TripModel | str:

    try:
        new_trip_id = db_handler.create_trip(destination, description, start_date, end_date, request.state.user['email'])
        trip_data = db_handler.get_trip_data(new_trip_id)
        
        return trip_data
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to create trip to {destination}"
            }
        )
    
@trip_router.get('/{trip_id}/permissions')
async def get_trip_permissions(request: Request, trip_id: str) -> dict | str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])
        permissions = db_handler.get_trip_permissions(trip_id, request.state.user['email'])
        
        return permissions
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to get permissions for {request.state.user['email']}"
            }
        )


@trip_router.delete('/{trip_id}')
async def delete_trip(request: Request, trip_id: str) -> dict[str, str]:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.delete_trip(trip_id)

        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Deleted trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to delete trip {trip_id}"
            }
        )
    
# --------------- ITINERARY OPERATIONS --------------- #

@trip_router.get('/{trip_id}/itinerary')
async def get_itinerary_info(request: Request, trip_id: str) -> list[ItineraryModel] | str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        itinerary = db_handler.get_itinerary(trip_id)

        return itinerary

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to retrieve itinerary for trip id {trip_id}"
            }
        )
    
@trip_router.post('/{trip_id}/itinerary')
async def add_itinerary_stop(
    request: Request,
    trip_id: str,
    title: Annotated[str, Form()],
    start_time: Annotated[datetime, Form()],
    end_time: Annotated[datetime, Form()],
    description: Annotated[str | None, Form()] = None
    ) ->  str:

    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.create_itinerary(trip_id, title, description, start_time, end_time, request.state.user['email'])
     
        return JSONResponse(
            status_code=200,
            content= {
                "message": "SUCCESS: Created itinerary stop"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to submit itinerary stop for trip id {trip_id}"
            }
        )
    
@trip_router.delete('/{trip_id}/itinerary/{item_id}')
async def delete_itinerary_stop(request: Request, trip_id: str, item_id: int) ->  str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.delete_itinerary(item_id)
     
        return JSONResponse(
            status_code=200,
            content= {
                "message": f"SUCCESS: Deleted itinerary stop from trip id {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to delete itinerary stop for trip id {trip_id}"
            }
        )
    
# --------------- POLL OPERATIONS --------------- #

@trip_router.get('/{trip_id}/poll')
async def get_polls(request: Request, trip_id: str) -> list[PollResponse] | str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])
        
        polls = db_handler.get_polls(trip_id)

        return polls
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to retrieve polls for trip id {trip_id}'
            }
        )
    

@trip_router.post('/{trip_id}/poll')
async def create_poll(request: Request, trip_id: str, poll_body: NewPollWS) -> dict[str, str]:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        poll_id = db_handler.create_poll(trip_id, poll_body.title, poll_body.description, request.state.user['email'])
        db_handler.create_poll_options(poll_id, poll_body.options)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Poll posted successfully for {poll_body.title}'
            }
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to post poll'
            }
        )

@trip_router.delete('/{trip_id}/poll/{poll_id}')
async def delete_poll(request: Request, trip_id: str, poll_id: int) -> dict[str, str]:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.delete_poll(poll_id)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Poll id {poll_id} deleted successfully'
            }
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to delete poll id {poll_id}'
            }
        )

# --------------- PACKING OPERATIONS --------------- #

@trip_router.get('/{trip_id}/packing')
async def get_packing_items(request: Request, trip_id: str) -> list[PackingModel] | dict[str, str]:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        items = db_handler.get_packing_items(trip_id)

        return items

    except Exception as error:
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to retrieve itms for trip {trip_id}'
            }
        )
    
@trip_router.post('/{trip_id}/packing')
async def add_packing_item(
    request: Request,
    trip_id: str,
    item: Annotated[str, Form()],
    quantity: Annotated[int, Form()],
    description: Annotated[str | None, Form()] = None
    ) -> dict[str, str]:

    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.create_packing_item(trip_id, item, quantity, description, request.state.user['email'])

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully added {item} to trip {trip_id}'
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to add packing item {item} to trip {trip_id}'
            }
        )

@trip_router.patch('/{trip_id}/packing/claim/{item_id}')
async def claim_packing_item(request: Request, trip_id: str, item_id: int) -> str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.claim_packing_item(request.state.user['email'], item_id)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully cliaimed item_id {item_id} on trip {trip_id}'
            }
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to claim item_id {item_id}'
            }
        )
    
@trip_router.patch('/{trip_id}/packing/unclaim/{item_id}')
async def unclaim_packing_item(request: Request, trip_id: str, item_id: int) -> str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.unclaim_packing_item(item_id)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully unclaimed item_id {item_id} on trip {trip_id}'
            }
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to unclaim item_id {item_id}'
            }
        )
    
@trip_router.delete('/{trip_id}/packing/{item_id}')
async def delete_packing_item(request: Request, trip_id: str, item_id: int) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.delete_packing_item(item_id)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully deleted item_id {item_id} from trip {trip_id}'
            }
        )

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to delete item_id {item_id} from trip {trip_id}'
            }
        )
    
# --------------- MESSAGE OPERATIONS --------------- #

@trip_router.get('/{trip_id}/message')
async def get_messages(request: Request, trip_id: str) -> list[MessageModel] | str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        msgs = db_handler.get_messages(trip_id)

        return msgs
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to retrieve messages for trip id {trip_id}'
            }
        )
    
@trip_router.delete('/{trip_id}/message')
async def delete_messages(request: Request, trip_id: str) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.delete_messages(trip_id)

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully deleted all messages from from trip {trip_id}'
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to delete messages for trip id {trip_id}'
            }
        )
    
# --------------- TRAVELLER OPERATIONS --------------- #

@trip_router.get('/{trip_id}/travellers')
async def get_travellers(request: Request, trip_id: str) ->  list[TravellerResponse] | str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])
        
        travellers = db_handler.get_travellers(trip_id)
        
        return travellers

    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find travellers for trip id {trip_id}"
            }
        )
