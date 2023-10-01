import socketio
import jwt
from utilities import Constants
from models.DatabaseHandler import db_handler
from utilities import auth_helpers
from models.Schemas import NewItineraryWS, ItineraryDeleteWS, NewPollWS, PollVoteWS, PollDeleteWS, MessageWS
import datetime


def parse_trip_id(query: str) -> str:
    query_components = query.split('&')
    query_elements = list(map(lambda q: q.split('='), query_components))
    for key, val in query_elements:
        if key == 'trip_id':
            return val
        
    return None

def date_to_string_flat(obj: dict) -> None:
    for key, val in obj.items():
        if type(val) is datetime.datetime:
            obj[key] = val.isoformat()

class ItinerarySocket(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        try:
            await auth_helpers.jwt_decode_w_retry(auth.get('token'))

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.exceptions.InvalidTokenError as token_error:
            print('PollSocket.on_connect: Invalid token\n', token_error)
            raise ConnectionRefusedError('Unauthorized connection attempt to ItininerarySocket')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from ItinerarySocket')

    async def on_frontend_itinerary_create(self, sid, data) -> None:
        try:
            itinerary_data = NewItineraryWS.parse_obj(data)     # Verify data
            itinerary_db = db_handler.create_itinerary(itinerary_data.trip_id, itinerary_data.title, itinerary_data.description, itinerary_data.start_time, itinerary_data.end_time, itinerary_data.created_by)
            date_to_string_flat(itinerary_db)
            await self.emit('backend_itinerary_create', itinerary_db, room = itinerary_data.trip_id)

        except Exception as error:
            print(error)
            await self.emit('backend_itinerary_create_error', {"message": 'Unable to create itinerary stop'}, room = data['trip_id'])

    async def on_frontend_itinerary_delete(self, sid, data) -> None:
        try:
            itinerary_delete = ItineraryDeleteWS.parse_obj(data)    # Verify data
            db_handler.delete_itinerary(itinerary_delete.itinerary_id)
            await self.emit('backend_itinerary_delete', itinerary_delete.itinerary_id, room = itinerary_delete.trip_id)
        
        except Exception as error:
            print(error)
            await self.emit('backend_itinerary_delete_error', {"message": 'Unable to delete itinerary stop'}, room = data['trip_id'])

class PollSocket(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        try:
            await auth_helpers.jwt_decode_w_retry(auth.get('token'))

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.exceptions.InvalidTokenError as token_error:
            print('PollSocket.on_connect: Invalid token\n', token_error)
            raise ConnectionRefusedError('Unauthorized connection attempt to PollSocket')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from PollSocket')

    async def on_frontend_poll_create(self, sid, data) -> None:
        try:
            new_poll = NewPollWS.parse_obj(data)    # Verify data
            poll_id = db_handler.create_poll(new_poll.trip_id, new_poll.title, new_poll.description, new_poll.created_by)
            db_handler.create_poll_options(poll_id, new_poll.options)
            new_poll_db = db_handler.get_poll(poll_id)
            date_to_string_flat(new_poll_db)

            await self.emit('backend_poll_create', new_poll_db, room = new_poll.trip_id)
        
        except Exception as error:
            print(error)
            await self.emit('backend_poll_create_error', {"message": 'Unable to create poll'}, room = data['trip_id'])

    async def on_frontend_vote(self, sid, data) -> None:
        # Because the poll data is handled in such a composite fashion,
        # we will not be returning the SQL result to the listeners
        try:
            poll_vote = PollVoteWS.parse_obj(data)  # Verify data
            db_handler.submit_vote(poll_vote.poll_id, poll_vote.option_id, poll_vote.voted_by)
            await self.emit('backend_vote', poll_vote.dict(), room = poll_vote.trip_id)

        except Exception as error:
            print(error)
            await self.emit('backend_vote_error', {"message": "Unable to submit vote"} , room = data['trip_id'])

    async def on_frontend_poll_delete(self, sid, data) -> None:
        try:
            poll_delete = PollDeleteWS.parse_obj(data)
            db_handler.delete_poll(poll_delete.poll_id)
            await self.emit('backend_poll_delete', poll_delete.poll_id, room = poll_delete.trip_id)

        except Exception as error:
            print(error)
            await self.emit('backend_poll_delete_error', {"message": 'Unable to delete poll'}, room = data['trip_id'])
        
class PackingSocket(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        try:
            await auth_helpers.jwt_decode_w_retry(auth.get('token'))

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.exceptions.InvalidTokenError as token_error:
            print('PollSocket.on_connect: Invalid token\n', token_error)
            raise ConnectionRefusedError('Unauthorized connection attempt to PackingSocket')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from PackingSocket')
    
    async def on_create_packing_item(self, sid, data) -> None:
        # FIXME:
        try:
            pass
        except Exception as error:
            print(error)
            await self.emit('_error', {"message": 'Unable to create poll'}, room = data['trip_id'])

    async def on_delete_packing_item(self, sid, data) -> None:
        # FIXME:
        try:
            pass
        except Exception as error:
            print(error)
            await self.emit('_error', {"message": 'Unable to create poll'}, room = data['trip_id'])

    async def on_claim_packing_item(self, sid, data) -> None:
        # FIXME:
        try:
            pass
        except Exception as error:
            print(error)
            await self.emit('_error', {"message": 'Unable to create poll'}, room = data['trip_id'])

    async def on_unclaim_packing_item(self, sid, data) -> None:
        # FIXME:
        try:
            pass
        except Exception as error:
            print(error)
            await self.emit('_error', {"message": 'Unable to create poll'}, room = data['trip_id'])
class MsgSocket(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        try:
            await auth_helpers.jwt_decode_w_retry(auth.get('token'))

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.exceptions.InvalidTokenError as token_error:
            print('MsgSocket.on_connect: Invalid token\n', token_error)
            raise ConnectionRefusedError('Unauthorized connection attempt to MsgSocket')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from MsgSocket')

    async def on_frontend_msg(self, sid, data):
        try:
            msg = MessageWS.parse_obj(data)     # Verify data
            db_msg = db_handler.create_msg(msg.trip_id, msg.content, msg.created_by)
            date_to_string_flat(db_msg)
            await self.emit('backend_msg', db_msg, room = msg.trip_id)

        except Exception as error:
            print(error)
            await self.emit('backend_msg_error', {"message": "Unable to submit message"} , room = data['trip_id'])

# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio.register_namespace(ItinerarySocket('/itinerary'))
sio.register_namespace(PollSocket('/poll'))
sio.register_namespace(PackingSocket('/packing'))
sio.register_namespace(MsgSocket('/message'))

socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version
