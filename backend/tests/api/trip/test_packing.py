"""HTTP integration tests using real middleware and PostgreSQL."""
from models.database_seed import TROY_EMAIL

import pytest

pytestmark = pytest.mark.asyncio


async def test_packing_lifecycle(api, db, owner_headers, seeded_trip):
    trip = seeded_trip
    base = f'/api/v1/trip/{trip}'
    response = await api.post(base + '/packing', headers=owner_headers, data={'item': 'Camera', 'quantity': 1})
    assert response.status_code == 200
    item = (await api.get(base + '/packing', headers=owner_headers)).json()[0]
    assert item['item'] == 'Camera'
    assert (await api.patch(base + f'/packing/claim/{item["id"]}', headers=owner_headers)).status_code == 200
    assert (await db.get_packing_items(trip))[0]['packed_by'] == TROY_EMAIL
    assert (await api.patch(base + f'/packing/unclaim/{item["id"]}', headers=owner_headers)).status_code == 200
    assert (await db.get_packing_items(trip))[0]['packed_by'] is None
    assert (await api.delete(base + f'/packing/{item["id"]}', headers=owner_headers)).status_code == 200
    assert await db.get_packing_items(trip) == []
