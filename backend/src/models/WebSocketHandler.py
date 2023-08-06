import socketio
import jwt
from utilities import Constants


# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version

@sio.event
async def connect(sid, environ):
    try:
        query_string = environ.get('QUERY_STRING')
        query_params = dict(qc.split("=") for qc in query_string.split("&"))
        token = query_params['token']
        
        jwt.decode(token, Constants.SECRET, algorithms=Constants.ALGORITHM)

    except jwt.InvalidTokenError:
        return False  # Connection denied
    
# @sio.event(namespace='/message')
# async def connect(sid, environ):
#     try:
#         print('CONNECTING TO MESSAGE')
#         query_string = environ.get('QUERY_STRING')
#         query_params = dict(qc.split("=") for qc in query_string.split("&"))
#         token = query_params['token']
#         trip_id = query_params['trip_id']
        
#         jwt.decode(token, Constants.SECRET, algorithms=Constants.ALGORITHM)

#         print('I DECODED THE JWT IN MESSAGE!')

#         # If token is valid, we set the user_id in the session
#         sio.enter_room(sid, trip_id)

#         print('I GOT HERE PLEASE!!!')

#         print(f'INTERNAL: Client {sid} connected to trip_id {trip_id}')
    
#     except jwt.InvalidTokenError:
#         return False  # Connection denied
    
# @sio.event(namespace='/poll')
# async def connect(sid, environ):
#     try:
#         print('CONNECTING TO POLL!')
#         query_string = environ.get('QUERY_STRING')
#         query_params = dict(qc.split("=") for qc in query_string.split("&"))
#         token = query_params['token']
#         trip_id = query_params['trip_id']
        
#         jwt.decode(token, Constants.SECRET, algorithms=Constants.ALGORITHM)

#         print('I DECODED THE JWT IN POLL!')

#         # If token is valid, we set the user_id in the session
#         sio.enter_room(sid, trip_id)

#         print('I GOT HERE PLEASE!!!')

#         print(f'INTERNAL: Client {sid} connected to trip_id {trip_id}')
    
#     except jwt.InvalidTokenError:
#         return False  # Connection denied


@sio.on('connect_error')
async def on_connect_err(sid):
    print(f'INTERNAL: Connection error: {sid}')


@sio.event
async def disconnect(sid):
    print(f'INTERNAL: Client disconnected: {sid}')


@sio.on('poll_msg', namespace = '/poll')
async def on_poll_msg(sid, data):
    print('HERE I AM!')
    print('ayye', data)

    # emit to all listeners - no "room" parameter
    # await sio.emit('server_poll_msg', 'ayye', namespace = '/poll', room = data['trip_id'])


@sio.on('board_msg', namespace = '/message')
async def on_board_msg(sid, data):
    print('yo')

    # emit to all listeners - no "room" parameter
    # await sio.emit('server_board_msg', 'yo', namespace = '/message', room = data['trip_id'])

