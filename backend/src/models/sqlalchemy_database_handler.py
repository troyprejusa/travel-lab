from datetime import datetime
from uuid import UUID

import psycopg
from sqlalchemy import URL, delete, func, insert, select, update
from sqlalchemy.exc import DBAPIError, ResourceClosedError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from utilities import constants
from utilities.merge_polls import merge_polls
from .database_interface import DatabaseHandler
from .orm_models import Itinerary, Message, Packing, Poll, PollOption, PollVote, Traveller, TravellerTrip, Trip


class SQLAlchemyDatabaseHandler(DatabaseHandler):
    def __init__(self, host: str, port: str, user: str, password: str, database: str) -> None:
        url = URL.create('postgresql+psycopg', username=user, password=password, host=host, port=int(port), database=database)
        self.engine = create_async_engine(url, pool_size=constants.DB_CONN_LIMIT, max_overflow=0)
        self.sessions = async_sessionmaker(self.engine, expire_on_commit=False)

    async def open(self):
        async with self.engine.connect():
            pass

    async def close(self):
        await self.engine.dispose()

    async def query(self, query, params=None):
        # Compatibility for existing schema setup and legacy callers.
        try:
            async with self.engine.begin() as connection:
                result = await connection.exec_driver_sql(query, params)
                if not result.returns_rows:
                    return None
                return [
                    {key: str(value) if isinstance(value, UUID) else value for key, value in row.items()}
                    for row in result.mappings()
                ]
        except DBAPIError as error:
            if isinstance(error.orig, psycopg.ProgrammingError):
                return None
            if isinstance(error.orig, psycopg.Error):
                raise error.orig from error
            raise

    async def _run(self, statement):
        try:
            async with self.sessions.begin() as session:
                result = await session.execute(statement)
                try:
                    return [dict(row) for row in result.mappings()]
                except ResourceClosedError:
                    return []
        except DBAPIError as error:
            if isinstance(error.orig, psycopg.Error):
                raise error.orig from error
            raise

    async def _select(self, model, *conditions, order_by=None):
        stmt = select(*model.__table__.c).where(*conditions)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        return await self._run(stmt)

    async def _create(self, model, **values):
        return (await self._run(insert(model).values(**values).returning(*model.__table__.c)))[0]

    async def _count(self, model, *conditions):
        return (await self._run(select(func.count()).select_from(model).where(*conditions)))[0]['count']

    @staticmethod
    def _traveller_id(email):
        return select(Traveller.id).where(Traveller.email == email).scalar_subquery()

    async def get_user(self, email):
        rows = await self._select(Traveller, Traveller.email == email)
        return rows[0] if rows else None

    async def create_user(self, email):
        return await self._create(Traveller, email=email)

    async def patch_user_info(self, first_name, last_name, phone, email):
        rows = await self._run(update(Traveller).where(Traveller.email == email).values(first_name=first_name, last_name=last_name, phone=phone).returning(*Traveller.__table__.c))
        return rows[0]

    async def delete_user(self, email):
        await self._run(delete(Traveller).where(Traveller.email == email))

    async def get_trips(self, email):
        ids = select(TravellerTrip.trip_id).where(TravellerTrip.confirmed.is_(True), TravellerTrip.traveller_id == self._traveller_id(email))
        return await self._select(Trip, Trip.id.in_(ids))

    async def get_user_trip_attendance(self, email):
        stmt = select(TravellerTrip.trip_id, TravellerTrip.admin).where(
            TravellerTrip.traveller_id == self._traveller_id(email),
            TravellerTrip.confirmed.is_(True),
        )
        return await self._run(stmt)

    async def leave_trip(self, email, trip_id):
        await self._run(delete(TravellerTrip).where(TravellerTrip.traveller_id == self._traveller_id(email), TravellerTrip.trip_id == trip_id))

    async def request_trip(self, email, trip_id):
        await self._run(insert(TravellerTrip).values(traveller_id=self._traveller_id(email), trip_id=trip_id, confirmed=False, admin=False))

    async def accept_request(self, requestor_id, trip_id):
        await self._run(update(TravellerTrip).where(TravellerTrip.traveller_id == requestor_id, TravellerTrip.trip_id == trip_id).values(confirmed=True))

    async def remove_traveller(self, traveller_id, trip_id):
        await self._run(delete(TravellerTrip).where(TravellerTrip.traveller_id == traveller_id, TravellerTrip.trip_id == trip_id))

    async def create_trip(self, destination, description, start_date, end_date, vacation_type, email):
        try:
            async with self.sessions.begin() as session:
                trip = Trip(destination=destination, description=description, start_date=start_date, end_date=end_date, vacation_type=vacation_type, created_by=email)
                session.add(trip)
                await session.flush()
                user_id = (await session.execute(select(Traveller.id).where(Traveller.email == email))).scalar_one_or_none()
                session.add(TravellerTrip(traveller_id=user_id, trip_id=trip.id, confirmed=True, admin=True))
                return trip.id
        except DBAPIError as error:
            if isinstance(error.orig, psycopg.Error):
                raise error.orig from error
            raise

    async def get_trip_data(self, trip_id):
        return (await self._select(Trip, Trip.id == trip_id, order_by=Trip.start_date))[0]

    async def get_trip_permissions(self, trip_id, email):
        return (await self._run(select(TravellerTrip.confirmed, TravellerTrip.admin).where(TravellerTrip.trip_id == trip_id, TravellerTrip.traveller_id == self._traveller_id(email))))[0]

    async def delete_trip(self, trip_id):
        return (await self._run(delete(Trip).where(Trip.id == trip_id).returning(*Trip.__table__.c)))[0]

    async def get_itinerary(self, trip_id):
        return await self._select(Itinerary, Itinerary.trip_id == trip_id, order_by=Itinerary.start_time)

    async def create_itinerary(self, trip_id, title, description, start_time, end_time, email):
        return await self._create(Itinerary, trip_id=trip_id, title=title, description=description, start_time=datetime.fromisoformat(start_time), end_time=datetime.fromisoformat(end_time), created_by=email)

    async def delete_itinerary(self, stop_id):
        await self._run(delete(Itinerary).where(Itinerary.id == stop_id))

    async def _polls(self, condition):
        stmt = (select(Poll.id.label('poll_id'), Poll.title, Poll.description, Poll.created_at, Poll.created_by,
                       PollOption.id.label('option_id'), PollOption.option, PollVote.voted_by)
                .join(PollOption, Poll.id == PollOption.poll_id)
                .outerjoin(PollVote, PollOption.id == PollVote.vote)
                .where(condition).order_by(Poll.id, PollOption.id))
        return [poll.model_dump() for poll in merge_polls(await self._run(stmt))]

    async def get_polls(self, trip_id):
        return await self._polls(Poll.trip_id == trip_id)

    async def get_poll(self, poll_id):
        return (await self._polls(Poll.id == poll_id))[0]

    async def create_poll(self, trip_id, title, description, creator_email):
        return (await self._create(Poll, trip_id=trip_id, title=title, description=description, created_by=creator_email))['id']

    async def create_poll_options(self, poll_id, options):
        for option in options:
            await self._run(insert(PollOption).values(poll_id=poll_id, option=option))

    async def submit_vote(self, poll_id, poll_option_id, voter_email):
        await self._run(insert(PollVote).values(poll_id=poll_id, vote=poll_option_id, voted_by=voter_email))

    async def delete_poll(self, poll_id):
        await self._run(delete(Poll).where(Poll.id == poll_id))

    async def get_packing_items(self, trip_id):
        return await self._select(Packing, Packing.trip_id == trip_id, order_by=Packing.id)

    async def create_packing_item(self, trip_id, item, quantity, description, email):
        return await self._create(Packing, trip_id=trip_id, item=item, quantity=quantity, description=description, created_by=email)

    async def claim_packing_item(self, email, item_id):
        await self._run(update(Packing).where(Packing.packed_by.is_(None), Packing.id == item_id).values(packed_by=email))

    async def unclaim_packing_item(self, item_id):
        await self._run(update(Packing).where(Packing.packed_by.is_not(None), Packing.id == item_id).values(packed_by=None))

    async def delete_packing_item(self, item_id):
        await self._run(delete(Packing).where(Packing.id == item_id))

    async def get_messages(self, trip_id):
        return await self._select(Message, Message.trip_id == trip_id, order_by=Message.id)

    async def create_msg(self, trip_id, content, created_by):
        return await self._create(Message, trip_id=trip_id, content=content, created_by=created_by)

    async def delete_messages(self, trip_id):
        await self._run(delete(Message).where(Message.trip_id == trip_id))

    async def get_travellers(self, trip_id):
        stmt = (select(*Traveller.__table__.c, TravellerTrip.confirmed, TravellerTrip.admin)
                .join(TravellerTrip, Traveller.id == TravellerTrip.traveller_id)
                .where(TravellerTrip.trip_id == trip_id).order_by(Traveller.last_name))
        return await self._run(stmt)

    async def count_users(self):
        return await self._count(Traveller)

    async def count_user_created_trips(self, email):
        return await self._count(Trip, Trip.created_by == email)

    async def count_user_trips_attended(self, email):
        return await self._count(TravellerTrip, TravellerTrip.traveller_id == self._traveller_id(email))

    async def count_travellers_on_trip(self, trip_id):
        return await self._count(TravellerTrip, TravellerTrip.trip_id == trip_id)

    async def count_itinerary(self, trip_id):
        return await self._count(Itinerary, Itinerary.trip_id == trip_id)

    async def count_polls(self, trip_id):
        return await self._count(Poll, Poll.trip_id == trip_id)

    async def count_packing(self, trip_id):
        return await self._count(Packing, Packing.trip_id == trip_id)

    async def count_messages(self, trip_id):
        return await self._count(Message, Message.trip_id == trip_id)
