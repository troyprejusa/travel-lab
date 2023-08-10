import socketio
import jwt
from utilities import Constants
from models.DatabaseHandler import db_handler


class MsgSocket(socketio.AsyncNamespace):
    def on_connect(self, sid, environ, auth):
        try:
            jwt.decode(auth.get('token'), Constants.SECRET, algorithms=Constants.ALGORITHM)

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.InvalidTokenError:
            raise ConnectionRefusedError(f'{sid} authentication failed')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from message socket')
        pass

    async def on_frontend_msg(self, sid, data):
        try:
            db_handler.query("""
                INSERT INTO message (
                trip_id, content, created_by          
                ) VALUES (
                    %s, %s, %s    
                )
            """, (data['trip_id'], data['content'], data['created_by']))

            await self.emit('backend_msg', data, room = data['trip_id'])

        except Exception as e:
            print(str(e))
            raise Exception('Unable to process message from frontend')



class PollSocket(socketio.AsyncNamespace):
    def on_connect(self, sid, environ, auth):
        try:
            jwt.decode(auth.get('token'), Constants.SECRET, algorithms=Constants.ALGORITHM)

            # Enter the correct room for this trip
            trip_id = parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.InvalidTokenError:
            raise ConnectionRefusedError(f'{sid} authentication failed')

    def on_disconnect(self, sid):
        print(f'{sid} disconnected from poll socket')
        pass

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
