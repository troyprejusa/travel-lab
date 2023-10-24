import socketio
import jwt
from utilities import Constants, auth_helpers, middleware
from models.DatabaseHandler import db_handler
from models.Schemas import \
    NewItineraryWS, ItineraryDeleteWS, \
    NewPollWS, PollVoteWS, PollDeleteWS, \
    NewPackingWS, PackingClaimWS, PackingUnclaimWS, PackingDeleteWS, \
    MessageWS
import datetime
import time


ws_rate_tracker = middleware.RateTracker(Constants.WS_REQUEST_COUNT, Constants.WS_REQUEST_WINDOW)

class WebSocketHandler(socketio.AsyncNamespace):

    # Interceptor (middleware) for all events
    async def trigger_event(self, event, sid, *args):
        # print('I got a message!', event)
        ok = ws_rate_tracker.add_entry(sid)
        if ok:
            # Continue processing
            await super().trigger_event(event, sid, *args)
        else:
            # Disconnect potentially malicious user
            print(f'Disconnecting sid {sid}')
            await self.emit('rate_limit_exceeded', {"message": f"Rate limit exceeded in {self.__class__.__name__}"})
            await self.disconnect(sid)

    async def on_connect(self, sid, environ, auth):
        try:
            await auth_helpers.jwt_decode_w_retry(auth.get('token'))

            # Enter the correct room for this trip
            trip_id = WebSocketHandler.parse_trip_id(environ['QUERY_STRING'])
            self.enter_room(sid, trip_id)

        except jwt.exceptions.InvalidTokenError as token_error:
            print(f'{self.__class__.__name__}.on_connect: Invalid token\n', token_error)
            raise ConnectionRefusedError(f'Unauthorized connection attempt to {self.__class__.__name__}')
        
        except Exception as error:
            print(f'{self.__class__.__name__}.on_connect:\n', error)
            raise ConnectionRefusedError(f'Error during connection attempt to {self.__class__.__name__}')

    def on_disconnect(self, sid):
        # print(f'{sid} disconnected from {self.__class__.__name__}')
        pass

    async def reply_error(self, sid, event: str, msg: str):
        await self.emit(event, {"message": msg}, to=sid)

    @staticmethod
    def parse_trip_id(query: str) -> str:
        query_components = query.split('&')
        query_elements = list(map(lambda q: q.split('='), query_components))
        for key, val in query_elements:
            if key == 'trip_id':
                return val
        
        # Because the trip id is essential to this module, throw if none is provided
        raise KeyError('Trip id not found in query parameters')
    
    @staticmethod
    def date_to_string_flat(obj: dict) -> None:
        for key, val in obj.items():
            if type(val) is datetime.datetime:
                obj[key] = val.isoformat()


class ItinerarySocket(WebSocketHandler):

    async def on_frontend_itinerary_create(self, sid, data) -> None:
        try:
            itinerary_data = NewItineraryWS.parse_obj(data)     # Verify data

            if db_handler.count_itinerary(itinerary_data.trip_id) >= Constants.LIMIT_ITINERARY_PER_TRIP:
                await self.reply_error(sid, 'backend_itinerary_create_error', "Reached limit for number of itinerary stops for trip. Delete other itinerary stops on this trip to create more.")
                return

            itinerary_db = db_handler.create_itinerary(itinerary_data.trip_id, itinerary_data.title, itinerary_data.description, itinerary_data.start_time, itinerary_data.end_time, itinerary_data.created_by)
            WebSocketHandler.date_to_string_flat(itinerary_db)
            await self.emit('backend_itinerary_create', itinerary_db, room = itinerary_data.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_itinerary_create_error', 'Unable to create itinerary stop')

    async def on_frontend_itinerary_delete(self, sid, data) -> None:
        try:
            itinerary_delete = ItineraryDeleteWS.parse_obj(data)    # Verify data
            db_handler.delete_itinerary(itinerary_delete.itinerary_id)
            await self.emit('backend_itinerary_delete', itinerary_delete.itinerary_id, room = itinerary_delete.trip_id)
        
        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_itinerary_delete_error', 'Unable to delete itinerary stop')


class PollSocket(WebSocketHandler):

    async def on_frontend_poll_create(self, sid, data) -> None:
        try:
            new_poll = NewPollWS.parse_obj(data)    # Verify data

            if db_handler.count_polls(new_poll.trip_id) >= Constants.LIMIT_POLLS_PER_TRIP:
                await self.reply_error(sid, 'backend_poll_create_error', "Reached limit for number of polls on this trip. Delete an existing poll before creating another.")
                return
            
            poll_id = db_handler.create_poll(new_poll.trip_id, new_poll.title, new_poll.description, new_poll.created_by)
            db_handler.create_poll_options(poll_id, new_poll.options)
            new_poll_db = db_handler.get_poll(poll_id)
            WebSocketHandler.date_to_string_flat(new_poll_db)

            await self.emit('backend_poll_create', new_poll_db, room = new_poll.trip_id)
        
        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_poll_create_error', 'Unable to create poll')

    async def on_frontend_vote(self, sid, data) -> None:
        # Because the poll data is handled in such a composite fashion,
        # we will not be returning the SQL result to the listeners
        try:
            poll_vote = PollVoteWS.parse_obj(data)  # Verify data
            db_handler.submit_vote(poll_vote.poll_id, poll_vote.option_id, poll_vote.voted_by)
            await self.emit('backend_vote', poll_vote.dict(), room = poll_vote.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_vote_error', 'Unable to submit vote')

    async def on_frontend_poll_delete(self, sid, data) -> None:
        try:
            poll_delete = PollDeleteWS.parse_obj(data)  # Verify data
            db_handler.delete_poll(poll_delete.poll_id)
            await self.emit('backend_poll_delete', poll_delete.poll_id, room = poll_delete.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_poll_delete_error', 'Unable to delete poll')


class PackingSocket(WebSocketHandler):
    
    async def on_frontend_packing_create(self, sid, data) -> None:
        try:
            new_item = NewPackingWS.parse_obj(data)     # Verify data

            if db_handler.count_packing(new_item.trip_id) >= Constants.LIMIT_PACKING_PER_TRIP:
                await self.reply_error(sid, 'backend_packing_create_error', "Reached limit for number of packing items on this trip. Delete an existing item before creating another.")
                return
            
            item_db = db_handler.create_packing_item(new_item.trip_id, new_item.item, new_item.quantity, new_item.description, new_item.created_by)
            WebSocketHandler.date_to_string_flat(item_db)
            await self.emit('backend_packing_create', item_db, room = new_item.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_packing_create_error', 'Unable to create packing item')

    async def on_frontend_packing_claim(self, sid, data) -> None:
        try:
            claim_data = PackingClaimWS.parse_obj(data)     # Verify data
            db_handler.claim_packing_item(claim_data.email, claim_data.item_id)
            await self.emit('backend_packing_claim', claim_data.dict(), room = claim_data.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_packing_claim_error', 'Unable to claim item')

    async def on_frontend_packing_unclaim(self, sid, data) -> None:
        try:
            unclaim_data = PackingUnclaimWS.parse_obj(data)     # Verify data
            db_handler.unclaim_packing_item(unclaim_data.item_id)
            await self.emit('backend_packing_claim', unclaim_data.dict(), room = unclaim_data.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_packing_unclaim_error', 'Unable to unclaim item')

    async def on_frontend_packing_delete(self, sid, data) -> None:
        try:
            item_delete = PackingDeleteWS.parse_obj(data)   # Verify data
            db_handler.delete_packing_item(item_delete.item_id)
            await self.emit('backend_packing_delete', item_delete.item_id, room = item_delete.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_packing_delete_error', 'Unable to delete item')


class MsgSocket(WebSocketHandler):

    async def on_frontend_msg(self, sid, data):
        try:
            msg = MessageWS.parse_obj(data)     # Verify data

            if db_handler.count_messages(msg.trip_id) >= Constants.LIMIT_MESSAGES_PER_TRIP:
                await self.reply_error(sid, 'backend_msg_error', "Reached limit for messages for this trip. Delete existing messages before submitting another.")
                return

            db_msg = db_handler.create_msg(msg.trip_id, msg.content, msg.created_by)
            WebSocketHandler.date_to_string_flat(db_msg)
            await self.emit('backend_msg', db_msg, room = msg.trip_id)

        except Exception as error:
            print(error)
            await self.reply_error(sid, 'backend_msg_error', 'Unable to submit message')


# Setup websocket server - Socket.io
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio.register_namespace(ItinerarySocket('/itinerary'))
sio.register_namespace(PollSocket('/poll'))
sio.register_namespace(PackingSocket('/packing'))
sio.register_namespace(MsgSocket('/message'))

socketio_ASGI = socketio.ASGIApp(sio)   # Create ASGI wrapped version
