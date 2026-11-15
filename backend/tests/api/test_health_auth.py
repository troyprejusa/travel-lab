from types import SimpleNamespace
from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

from auth.models import JwtPayload
from main import app
from routers import user_router
from utilities import middleware


def test_health_is_public_and_not_served_as_a_static_file(monkeypatch):
    monkeypatch.setattr(middleware, 'auth_service', SimpleNamespace(jwt_decode_w_retry=AsyncMock()))
    middleware.rest_rate_tracker.tracker.clear()
    response = TestClient(app).get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}
    middleware.auth_service.jwt_decode_w_retry.assert_not_awaited()


def test_api_rejects_requests_without_a_token():
    middleware.rest_rate_tracker.tracker.clear()
    response = TestClient(app).get('/api/v1/user/trips')
    assert response.status_code == 401
    assert response.json()['detail']['message'] == 'Authentication required'


def test_api_accepts_a_valid_token(monkeypatch):
    decode = AsyncMock(return_value=JwtPayload(sub='dev|troy', email='troy@test.com'))
    monkeypatch.setattr(middleware, 'auth_service', SimpleNamespace(jwt_decode_w_retry=decode))
    monkeypatch.setattr(middleware.auth_helpers, 'establish_user_attendance', AsyncMock(return_value={}))
    monkeypatch.setattr(user_router.db_handler, 'get_trips', AsyncMock(return_value=[]))
    middleware.rest_rate_tracker.tracker.clear()
    response = TestClient(app).get('/api/v1/user/trips', headers={'Authorization': 'Bearer test-token'})
    assert response.status_code == 200
    assert response.json() == []
    decode.assert_awaited_once_with('test-token')
