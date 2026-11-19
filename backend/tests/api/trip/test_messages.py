"""HTTP integration tests using real middleware and PostgreSQL."""
from models.database_seed import TROY_EMAIL

import pytest

pytestmark = pytest.mark.asyncio


async def test_messages_lifecycle(api, db, owner_headers, seeded_trip):
    trip = seeded_trip
    base = f'/api/v1/trip/{trip}'
    await db.create_msg(trip, 'Hello', TROY_EMAIL)
    assert (await api.get(base + '/message', headers=owner_headers)).json()[0]['content'] == 'Hello'
    assert (await api.delete(base + '/message', headers=owner_headers)).status_code == 200
    assert await db.get_messages(trip) == []
