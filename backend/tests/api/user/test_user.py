"""HTTP integration tests using real middleware and PostgreSQL."""
import pytest

pytestmark = pytest.mark.asyncio


async def test_user_upsert_and_patch(api, db, owner_headers):
    url = '/api/v1/user/troy@test.com'
    first = await api.post(url, headers=owner_headers)
    assert first.status_code == 200
    assert first.json()['id'] == (await db.get_user('troy@test.com'))['id']
    created = await api.post('/api/v1/user/new@example.com', headers=owner_headers)
    assert created.status_code == 200
    assert (await db.get_user('new@example.com'))['id'] == created.json()['id']
    response = await api.patch(url, headers=owner_headers, data={'first_name': 'Troy', 'last_name': 'Tester', 'phone': '5551234567'})
    assert response.status_code == 200
    assert (await db.get_user('troy@test.com'))['first_name'] == 'Troy'
    assert (await api.patch(url, headers=owner_headers, data={'first_name': 'Missing'})).status_code == 422


async def test_trip_and_membership_lifecycle(api, db, owner_headers, guest_headers):
    response = await api.post('/api/v1/trip/', headers=owner_headers, data={'destination': 'Kyoto', 'start_date': '2026-04-01', 'end_date': '2026-04-08', 'vacation_type': 'city'})
    assert response.status_code == 200, response.text
    trip = response.json()['id']
    base = f'/api/v1/trip/{trip}'
    assert (await api.get(base + '/permissions', headers=owner_headers)).json() == {'confirmed': True, 'admin': True}
    assert (await api.get('/api/v1/user/trips', headers=owner_headers)).json()[0]['id'] == trip
    guest = await db.get_user('joe@test.com')
    assert (await api.post(f'/api/v1/user/trips/{trip}', headers=guest_headers)).status_code == 200
    assert (await api.get('/api/v1/user/trips', headers=guest_headers)).json() == []
    assert (await api.patch(f'/api/v1/user/trips/{trip}/{guest["id"]}', headers=owner_headers)).status_code == 200
    assert (await api.get(base + '/permissions', headers=guest_headers)).json() == {'confirmed': True, 'admin': False}
    travellers = (await api.get(base + '/travellers', headers=owner_headers)).json()
    assert {person['email'] for person in travellers} == {'troy@test.com', 'joe@test.com'}
    assert (await api.delete(f'/api/v1/user/trips/{trip}', headers=guest_headers)).status_code == 200
    assert (await api.post(f'/api/v1/user/trips/{trip}', headers=guest_headers)).status_code == 200
    assert (await api.delete(f'/api/v1/user/trips/{trip}/{guest["id"]}', headers=owner_headers)).status_code == 200
    assert (await api.delete(base, headers=owner_headers)).status_code == 200
    assert await db.query('SELECT id FROM trip WHERE id=%s', (trip,)) == []
