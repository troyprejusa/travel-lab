"""HTTP integration tests using real middleware and PostgreSQL."""
from models.database_seed import JOE_EMAIL

import pytest

pytestmark = pytest.mark.asyncio


async def test_non_member_and_non_admin_cannot_modify_trip(api, db, guest_headers, seeded_trip):
    trip = seeded_trip
    base = f'/api/v1/trip/{trip}'
    assert (await api.get(base + '/itinerary', headers=guest_headers)).status_code != 200
    await db.request_trip(JOE_EMAIL, trip)
    guest = await db.get_user(JOE_EMAIL)
    await db.accept_request(guest['id'], trip)
    assert (await api.delete(base, headers=guest_headers)).status_code != 200
    assert await db.get_trip_data(trip) is not None
