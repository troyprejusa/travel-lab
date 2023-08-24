from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip, Traveller, Itinerary, Message, NewPollBody, PollResponseBody, Packing
from typing import Annotated
from datetime import date, datetime
from models.S3Handler import minio_client
from utilities.merge_polls import merge_polls


trip_router = APIRouter(
    prefix='/trip'
)

# Create a trip
@trip_router.post('/')
async def create_trip(
    request: Request,
    destination: Annotated[str, Form()],
    description: Annotated[str, Form()],
    start_date: Annotated[date, Form()],
    end_date: Annotated[date, Form()]
    ) -> Trip | dict[str, str]:   

    try:
        # This call must not only create the trip, but must add
        # this user to the trip in the same transaction so there
        # are no dangling trips
        data = db_handler.query("""
            WITH temp_table as (
                INSERT INTO trip 
                (destination, description, start_date, end_date, created_by)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            ) INSERT INTO traveller_trip VALUES (%s, (SELECT id from temp_table)) RETURNING trip_id;
                                
        """, (destination, description, start_date, end_date, request.state.user['email'], request.state.user['id']))
        trip_id = data[0]['trip_id']
        
        trip_data = db_handler.query("""
            SELECT * FROM trip WHERE id=%s;
        """, (trip_id,))[0]
        
        return trip_data
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to create trip to {destination}"
            }
        )

# Delete a trip
@trip_router.delete('/{trip_id}')
async def delete_trip(request: Request, trip_id: str) -> dict[str, str]:
    # TODO: Check if the delete requester is an admin on this trip
    try:
        db_handler.query("""
            DELETE FROM trip WHERE id = %s;
        """, (trip_id,))

        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Deleted trip {trip_id}"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to delete trip {trip_id}"
            }
        )

# Get contact info for travellers on this trip
@trip_router.get('/{trip_id}/contacts')
async def get_contact_info(trip_id: str) ->  list[Traveller] | dict[str, str]:
    try:
        travellers = db_handler.query("""
            SELECT * from traveller WHERE id in (SELECT traveller_id FROM traveller_trip WHERE trip_id=%s);
            """, (trip_id,))
        
        return travellers

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find travellers for trip id {trip_id}"
            }
        )


# Get itinerary for this trip
@trip_router.get('/{trip_id}/itinerary')
async def get_itinerary_info(trip_id: str) -> list[Itinerary] | dict[str, str]:
    try:
        itinerary = db_handler.query("""
            SELECT * FROM itinerary WHERE trip_id = %s
        """, (trip_id,))

        return itinerary

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to retrieve itinerary for trip id {trip_id}"
            }
        )

# Add itinerary item for this trip
@trip_router.post('/{trip_id}/itinerary')
async def add_itinerary_info(
    request: Request,
    trip_id: str,
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    start_time: Annotated[datetime, Form()],
    end_time: Annotated[datetime, Form()]
    ) ->  dict[str, str]:

    try:
        db_handler.query("""
        INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
        VALUES (%s, %s, %s, %s, %s, %s);
        """, (trip_id, title, description, start_time, end_time, request.state.user['email']))
     
        return JSONResponse(
            status_code=200,
            content= {
                "message": "SUCCESS: Created itinerary stop"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to submit itinerary stop for trip id {trip_id}"
            }
        )
    
@trip_router.get('/{trip_id}/message')
async def get_messages(trip_id: str) -> list[Message] | dict[str, str]:
    try:
        data = db_handler.query("""
            SELECT * FROM message WHERE trip_id = %s
        """, (trip_id,))

        return data
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to retrieve messages for trip id {trip_id}'
            }
        )
    

    
@trip_router.get('/{trip_id}/poll')
async def get_polls(trip_id: str) -> list[PollResponseBody] | dict[str, str]:
    try:
        # The results for one poll on this trip will have the following number
        # of rows:
        # M options * N people who voted this option, M >= 1 & N >= 1
        # Repeat this for P polls. It's kind of a mess to sort through, 
        # but at least we get everything we need out of 1 query.
        data = db_handler.query("""
            SELECT 
                poll.id AS poll_id,
                poll.title,
                poll.anonymous,
                poll.created_at,
                poll.created_by,
                poll_option.id AS option_id,
                poll_option.option,
                poll_vote.voted_by
            FROM 
                poll
            JOIN
                poll_option ON poll.id = poll_option.poll_id
            LEFT JOIN
                poll_vote ON poll_option.id = poll_vote.vote
            WHERE 
                poll.trip_id = %s
            ORDER BY poll.id, poll_option.id;
        """, (trip_id,))

        # With this table of data, we can either group it meaningfully
        # on the backend or the frontend. However, to be true to the
        # anonymous-ness of it all we will have to handle this on the
        # backend. Note that the below logic relies on the data being
        # SORTED by poll_id. This is basically a merge intervals problem
        output = merge_polls(data)

        return output
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to retrieve polls for trip id {trip_id}'
            }
        )

@trip_router.post('/{trip_id}/poll')
async def add_poll(request: Request, trip_id: str, poll_body: NewPollBody) -> dict[str, str]:
    try:
        res = db_handler.query("""
            INSERT INTO poll 
                (trip_id, title, anonymous, created_by) 
                VALUES (%s, %s, %s, %s)
            RETURNING id;
        """, (trip_id, poll_body.title, poll_body.anonymous, request.state.user['email']))
        poll_id = res[0]['id']

        # This would seem like a good place for a psycopg "executemany", but 
        # the docs say it's not faster than just calling execute on a loop
        for option in poll_body.options:
            db_handler.query("""
            INSERT INTO poll_option (poll_id, option) VALUES (%s, %s);
            """, (poll_id, option))

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Poll posted successfully for {poll_body.title}'
            }
        )

    except Exception as error:
        print(str(error))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to post poll'
            }
        )
    
@trip_router.delete('/{trip_id}/poll/{poll_id}')
async def delete_poll(request: Request, trip_id: str, poll_id: int) -> dict[str, str]:
    try:
        # Only allow deletion of a poll by the creator, or allow anyone to delete
        # if the creator deleted account (creator is null)
        count = db_handler.query("""
            DELETE FROM poll WHERE id=%s AND (created_by=%s OR created_by IS NULL);
        """, (poll_id, request.state.user['email']), row_count_only=True)

        if count != 1:
            raise Exception('Expected to delete one poll entry')

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Poll id {poll_id} deleted successfully'
            }
        )

    except Exception as error:
        print(str(error))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'ERROR: Unable to delete poll id {poll_id}'
            }
        ) 

@trip_router.get('/{trip_id}/packing')
async def get_packing_items(trip_id: str) -> list[Packing] | dict[str, str]:
    try:
        data = db_handler.query("""
            SELECT * FROM packing WHERE trip_id=%s;
        """, (trip_id,))

        return data

    except Exception as e:
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
        db_handler.query("""
            INSERT INTO packing (trip_id, item, quantity, description, created_by) 
            VALUES (%s, %s, %s, %s, %s)
        """, (trip_id, item, quantity, description, request.state.user['email']))

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully added {item} to trip {trip_id}'
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to add packing item {item} to trip {trip_id}'
            }
        )

@trip_router.delete('/{trip_id}/packing/{item_id}')
async def delete_packing_item(trip_id: str, item_id: int) -> dict[str, str]:
    try:
        db_handler.query("""
            DELETE FROM packing WHERE id=%s;
        """, (item_id,))

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully deleted item_id {item_id} from trip {trip_id}'
            }
        )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to delete item_id {item_id} from trip {trip_id}'
            }
        )


@trip_router.patch('/{trip_id}/packing/claim/{item_id}')
async def claim_packing_item(request: Request, trip_id: str, item_id: int) -> dict[str, str]:
    try:
        db_handler.query("""
            UPDATE packing SET packed_by = %s WHERE packed_by IS NULL AND id = %s;
        """, (request.state.user['email'], item_id))

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully cliaimed item_id {item_id} on trip {trip_id}'
            }
        )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to claim item_id {item_id}'
            }
        )

@trip_router.patch('/{trip_id}/packing/unclaim/{item_id}')
async def unclaim_packing_item(trip_id: str, item_id: int) -> dict[str, str]:
    try:
        db_handler.query("""
            UPDATE packing SET packed_by = NULL WHERE packed_by IS NOT NULL AND id = %s;
        """, (item_id,))

        return JSONResponse(
            status_code=200,
            content= {
                "message": f'Successfully unclaimed item_id {item_id} on trip {trip_id}'
            }
        )

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content= {
                "message": f'Unable to unclaim item_id {item_id}'
            }
        )
