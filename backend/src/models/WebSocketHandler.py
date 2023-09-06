import socketio
import jwt
from utilities import Constants
from models.DatabaseHandler import db_handler
from utilities import auth_helpers


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
        print(f'{sid} disconnected from message socket')

    async def on_frontend_msg(self, sid, data):
        try:
            db_handler.query("""
                INSERT INTO message (
                trip_id, content, created_by          
                ) VALUES (
                    %s, %s, %s    
                )
            """, (data['trip_id'], data['content'], data['created_by']))

            # If message was saved successfully, send to everyone else
            await self.emit('backend_msg', data, room = data['trip_id'])

        except Exception as error:
            print(error)
            raise Exception('Unable to process message from frontend')


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
        print(f'{sid} disconnected from poll socket')

    async def on_frontend_vote(self, sid, data) -> None | str:
        try:
            db_handler.query("""
                INSERT INTO poll_vote (poll_id, vote, voted_by) VALUES (%s, %s, %s);
            """, (data['poll_id'], data['option_id'], data['voted_by']))

            # If vote was successful, send to everyone else
            await self.emit('backend_vote', data, room = data['trip_id'])

        except Exception as error:
            print(error)
            raise Exception('Unable to vote on this poll')


def parse_trip_id(query: str) -> str:
    query_components = query.split('&')
    query_elements = list(map(lambda q: q.split('='), query_components))
    for key, val in query_elements:
        if key == 'trip_id':
            return val
        
    return None


# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio.register_namespace(MsgSocket('/message'))
sio.register_namespace(PollSocket('/poll'))

socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version
