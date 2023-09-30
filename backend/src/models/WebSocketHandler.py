import socketio
import jwt
from utilities import Constants
from models.DatabaseHandler import db_handler
from utilities import auth_helpers
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

    async def on_create_itinerary(self, sid, data) -> None:
        pass
    
    async def on_delete_itinerary(self, sid, data) -> None:
        pass

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

    async def on_create_poll(self, sid, data) -> None:
        pass

    async def on_delete_poll(self, sid, data) -> None:
        pass

    async def on_frontend_vote(self, sid, data) -> None:
        # Because the poll data is managed in such a composite fashion,
        # we will not be returning the SQL result to the listeners in 
        # this case
        try:
            db_handler.query("""
                INSERT INTO poll_vote (poll_id, vote, voted_by) VALUES (%s, %s, %s);
            """, (data['poll_id'], data['option_id'], data['voted_by']))

            await self.emit('backend_vote', data, room = data['trip_id'])

        except Exception as error:
            print(error)
            await self.emit('backend_vote_error', {"message": "Unable to submit vote"} , room = data['trip_id'])
        
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
        pass

    async def on_delete_packing_item(self, sid, data) -> None:
        pass

    async def on_claim_packing_item(self, sid, data) -> None:
        pass

    async def on_unclaim_packing_item(self, sid, data) -> None:
        pass

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
            db_msg = db_handler.query("""
                INSERT INTO message (
                trip_id, content, created_by          
                ) VALUES (
                    %s, %s, %s    
                )
                RETURNING *;
            """, (data['trip_id'], data['content'], data['created_by']))[0]

            date_to_string_flat(db_msg)

            await self.emit('backend_msg', db_msg, room = data['trip_id'])

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
