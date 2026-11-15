"""HTTP integration tests using real middleware and PostgreSQL."""
import pytest

pytestmark = pytest.mark.asyncio


async def test_itinerary_lifecycle(api, db, owner_headers, seeded_trip):
    trip = seeded_trip
    base = f'/api/v1/trip/{trip}'
    response = await api.post(base + '/itinerary', headers=owner_headers, data={'title': 'Temple', 'start_time': '2026-04-02T10:00:00', 'end_time': '2026-04-02T11:00:00'})
    assert response.status_code == 200, response.text
    stops = (await api.get(base + '/itinerary', headers=owner_headers)).json()
    assert [stop['title'] for stop in stops] == ['Temple']
    assert (await api.delete(base + f'/itinerary/{stops[0]["id"]}', headers=owner_headers)).status_code == 200
    assert await db.get_itinerary(trip) == []
