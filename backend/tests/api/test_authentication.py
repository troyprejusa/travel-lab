"""HTTP integration tests using real middleware and PostgreSQL."""
import pytest

pytestmark = pytest.mark.asyncio


async def test_health_and_authentication(api, owner_headers):
    assert (await api.get('/health')).json() == {'status': 'ok'}
    assert (await api.get('/api/v1/user/trips')).status_code == 401
    assert (await api.get('/api/v1/user/trips', headers={'Authorization': 'Bearer invalid'})).status_code == 401
    response = await api.get('/api/v1/user/trips', headers=owner_headers)
    assert response.status_code == 200
    assert response.json() == []
