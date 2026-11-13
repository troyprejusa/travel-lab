from datetime import date
from uuid import UUID

import pytest
import psycopg

pytestmark = pytest.mark.asyncio


async def make_trip(db):
    await db.create_user('owner@example.com')
    trip = await db.create_trip('Kyoto', 'Spring trip', date(2026, 4, 1), date(2026, 4, 8), 'city', 'owner@example.com')
    return trip


async def test_query_and_user_lifecycle(db):
    assert await db.query('SELECT 42 AS answer') == [{'answer': 42}]
    assert await db.get_user('alice@example.com') is None
    user = await db.create_user('alice@example.com')
    assert str(UUID(user['id'])) == user['id']
    assert await db.count_users() == 1
    updated = await db.patch_user_info('Alice', 'Smith', '5551234567', 'alice@example.com')
    assert (updated['first_name'], updated['last_name'], updated['phone']) == ('Alice', 'Smith', '5551234567')
    assert (await db.get_user('alice@example.com'))['id'] == user['id']
    await db.delete_user('alice@example.com')
    assert await db.get_user('alice@example.com') is None
    assert await db.count_users() == 0


async def test_duplicate_user_preserves_database_error_and_pool_recovers(db):
    await db.create_user('alice@example.com')
    with pytest.raises(psycopg.errors.UniqueViolation):
        await db.create_user('alice@example.com')
    assert await db.count_users() == 1


async def test_trips_and_membership(db):
    trip = await make_trip(db)
    guest = await db.create_user('guest@example.com')
    assert (await db.get_trip_data(trip))['destination'] == 'Kyoto'
    assert await db.get_trip_permissions(trip, 'owner@example.com') == {'confirmed': True, 'admin': True}
    assert await db.count_user_created_trips('owner@example.com') == 1
    await db.request_trip('guest@example.com', trip)
    assert await db.get_trips('guest@example.com') == []
    assert await db.count_user_trips_attended('guest@example.com') == 1
    assert await db.count_travellers_on_trip(trip) == 2
    await db.accept_request(guest['id'], trip)
    assert (await db.get_trips('guest@example.com'))[0]['id'] == trip
    assert len(await db.get_travellers(trip)) == 2
    await db.leave_trip('guest@example.com', trip)
    assert await db.count_travellers_on_trip(trip) == 1
    await db.request_trip('guest@example.com', trip)
    await db.remove_traveller(guest['id'], trip)
    assert await db.count_travellers_on_trip(trip) == 1
    assert (await db.delete_trip(trip))['id'] == trip
    assert await db.get_trips('owner@example.com') == []


async def test_itinerary_messages_and_packing(db):
    trip = await make_trip(db)
    stop = await db.create_itinerary(trip, 'Temple', None, '2026-04-02 10:00', '2026-04-02 11:00', 'owner@example.com')
    assert (await db.get_itinerary(trip))[0]['id'] == stop['id']
    assert await db.count_itinerary(trip) == 1
    await db.delete_itinerary(stop['id'])
    assert await db.get_itinerary(trip) == []
    message = await db.create_msg(trip, 'Hello', 'owner@example.com')
    assert (await db.get_messages(trip))[0]['id'] == message['id']
    assert await db.count_messages(trip) == 1
    await db.delete_messages(trip)
    assert await db.get_messages(trip) == []
    item = await db.create_packing_item(trip, 'Camera', 1, None, 'owner@example.com')
    assert await db.count_packing(trip) == 1
    await db.claim_packing_item('owner@example.com', item['id'])
    assert (await db.get_packing_items(trip))[0]['packed_by'] == 'owner@example.com'
    await db.unclaim_packing_item(item['id'])
    assert (await db.get_packing_items(trip))[0]['packed_by'] is None
    await db.delete_packing_item(item['id'])
    assert await db.get_packing_items(trip) == []


async def test_poll_options_votes_and_cascade(db):
    trip = await make_trip(db)
    poll_id = await db.create_poll(trip, 'Dinner', None, 'owner@example.com')
    await db.create_poll_options(poll_id, ['Ramen', 'Sushi'])
    poll = await db.get_poll(poll_id)
    assert [option['option'] for option in poll['options']] == ['Ramen', 'Sushi']
    assert all(option['votes'] == [] for option in poll['options'])
    await db.submit_vote(poll_id, poll['options'][0]['option_id'], 'owner@example.com')
    assert (await db.get_polls(trip))[0]['options'][0]['votes'] == ['owner@example.com']
    assert await db.count_polls(trip) == 1
    await db.delete_poll(poll_id)
    assert await db.get_polls(trip) == []
    assert await db.query('SELECT * FROM poll_option WHERE poll_id=%s', (poll_id,)) == []
    assert await db.query('SELECT * FROM poll_vote WHERE poll_id=%s', (poll_id,)) == []
