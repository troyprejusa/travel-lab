from sqlalchemy import BigInteger, Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Traveller(Base):
    __tablename__ = 'traveller'
    id = Column(UUID(as_uuid=False), primary_key=True, server_default=text('uuid_generate_v4()'))
    first_name = Column(String(40))
    last_name = Column(String(40))
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(11))


class Trip(Base):
    __tablename__ = 'trip'
    id = Column(UUID(as_uuid=False), primary_key=True, server_default=text('uuid_generate_v4()'))
    destination = Column(String(60), nullable=False)
    description = Column(String(200))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    vacation_type = Column(Enum('tropical', 'wilderness', 'city', 'historical', 'countryside', 'road_trip', 'winter', name='vacation_setting'), nullable=False)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    created_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))


class TravellerTrip(Base):
    __tablename__ = 'traveller_trip'
    traveller_id = Column(UUID(as_uuid=False), ForeignKey('traveller.id', ondelete='CASCADE'), primary_key=True)
    trip_id = Column(UUID(as_uuid=False), ForeignKey('trip.id', ondelete='CASCADE'), primary_key=True)
    confirmed = Column(Boolean, nullable=False, server_default=text('false'))
    admin = Column(Boolean, nullable=False, server_default=text('false'))


class Itinerary(Base):
    __tablename__ = 'itinerary'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(UUID(as_uuid=False), ForeignKey('trip.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(60), nullable=False)
    description = Column(String(200))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    created_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))


class Message(Base):
    __tablename__ = 'message'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(UUID(as_uuid=False), ForeignKey('trip.id', ondelete='CASCADE'), nullable=False)
    content = Column(String(1100), nullable=False)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    created_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))


class Poll(Base):
    __tablename__ = 'poll'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(UUID(as_uuid=False), ForeignKey('trip.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(40), nullable=False)
    description = Column(String(200))
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    created_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))


class PollOption(Base):
    __tablename__ = 'poll_option'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    poll_id = Column(BigInteger, ForeignKey('poll.id', ondelete='CASCADE'), nullable=False)
    option = Column(String(120), nullable=False)


class PollVote(Base):
    __tablename__ = 'poll_vote'
    __table_args__ = (UniqueConstraint('poll_id', 'voted_by'),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    poll_id = Column(BigInteger, ForeignKey('poll.id', ondelete='CASCADE'), nullable=False)
    vote = Column(BigInteger, ForeignKey('poll_option.id', ondelete='CASCADE'), nullable=False)
    voted_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    voted_by = Column(String(255), ForeignKey('traveller.email', ondelete='CASCADE'), nullable=False)


class Packing(Base):
    __tablename__ = 'packing'
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(UUID(as_uuid=False), ForeignKey('trip.id', ondelete='CASCADE'), nullable=False)
    item = Column(String(64), nullable=False)
    quantity = Column(Integer, nullable=False)
    description = Column(String(200))
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    created_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))
    packed_by = Column(String(255), ForeignKey('traveller.email', ondelete='SET NULL'))
