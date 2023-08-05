import socketio
import jwt
from utilities import Constants


# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version

# Connect without specifying namespaces, so new connections will
# have access to both namespaces
@sio.event
async def connect(sid, environ):
    print(f'INTERNAL: Client connected: {sid}')


@sio.on('connect_error')
async def on_connect_err(sid):
    print(f'INTERNAL: Connection error: {sid}')


@sio.event
async def disconnect(sid):
    print(f'INTERNAL: Client disconnected: {sid}')


@sio.on('authenticate')
async def on_authenticate(sid, data):
    # Handle JWT authentication
    try:
        # Decode the JWT - no exception on decode means we're good to proceed
        jwt.decode(data['token'], Constants.SECRET, algorithms=Constants.ALGORITHM)

        # Tell frontend that the user is authenticated
        await sio.emit('authenticated_user')
    
    except jwt.InvalidSignatureError as se:
        # Invalid JWT
        print(f'INTERNAL: Websocket Invalid JWT Signature, disconnecting {sid}')
        await sio.disconnect(sid)


@sio.on('poll_msg', namespace = '/poll')
async def on_poll_msg(sid, data):
    print('ayye')

    # emit to all listeners - no "room" parameter
    await sio.emit('server_poll_msg', 'ayye', namespace = '/poll', room = data['trip_id'])


@sio.on('board_msg', namespace = '/message')
async def on_board_msg(sid, data):
    print('yo')

    # emit to all listeners - no "room" parameter
    await sio.emit('server_board_msg', 'yo', namespace = '/message', room = data['trip_id'])

