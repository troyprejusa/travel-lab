import socketio
import jwt
from utilities import Constants

class MsgSocket(socketio.AsyncNamespace):
    def on_connect(self, sid, environ, auth):
        try:
            jwt.decode(auth.get('token'), Constants.SECRET, algorithms=Constants.ALGORITHM)
            print('MSGSOCKET ALL GOOD')

        except jwt.InvalidTokenError:
            raise ConnectionRefusedError('authentication failed')

    def on_disconnect(self, sid):
        pass

    async def on_frontend_msg(self, sid, data):
        print('/message recieved a message!', data)
        await self.emit('backend_msg', f'Your message was: {data}')



class PollSocket(socketio.AsyncNamespace):
    def on_connect(self, sid, environ, auth):
        try:
            jwt.decode(auth.get('token'), Constants.SECRET, algorithms=Constants.ALGORITHM)
            print('POLLSOCKET ALL GOOD')

        except jwt.InvalidTokenError:
            raise ConnectionRefusedError('authentication failed')

    def on_disconnect(self, sid):
        pass

    async def on_frontend_poll(self, sid, data):
        print('/poll recieved a message!', data)
        await self.emit('backend_poll', f'Your message was: {data}')



# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio.register_namespace(MsgSocket('/message'))
sio.register_namespace(PollSocket('/poll'))

socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version
