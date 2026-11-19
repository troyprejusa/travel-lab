"""HTTP integration tests using real middleware and PostgreSQL."""
from models.database_seed import TROY_EMAIL

import pytest

pytestmark = pytest.mark.asyncio


async def test_poll_lifecycle(api, db, owner_headers, seeded_trip):
    trip = seeded_trip
    base = f'/api/v1/trip/{trip}'
    response = await api.post(base + '/poll', headers=owner_headers, json={'trip_id': trip, 'created_by': TROY_EMAIL, 'title': 'Dinner', 'options': ['Ramen', 'Sushi']})
    assert response.status_code == 200, response.text
    polls = (await api.get(base + '/poll', headers=owner_headers)).json()
    assert [option['option'] for option in polls[0]['options']] == ['Ramen', 'Sushi']
    assert (await api.delete(base + f'/poll/{polls[0]["poll_id"]}', headers=owner_headers)).status_code == 200
    assert await db.get_polls(trip) == []
