from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import httpx
import pytest
from fastapi.testclient import TestClient

from auth.auth0_service import Auth0Service
from auth.clerk_service import ClerkService
from auth.dev_auth_service import DevAuthService
from auth.models import JwtPayload
from main import app
from routers import user_router
from utilities import middleware


@pytest.mark.asyncio
async def test_auth0_deletes_provider_user(monkeypatch):
    manager = Mock()
    service = Auth0Service()
    monkeypatch.setattr(service, 'get_manager', lambda: manager)
    await service.delete_user('auth0|123')
    manager.users.delete.assert_called_once_with('auth0|123')


@pytest.mark.asyncio
async def test_development_delete_has_no_external_account():
    await DevAuthService().delete_user('dev|troy@test.com')


@pytest.mark.asyncio
async def test_clerk_deletes_provider_user(monkeypatch):
    monkeypatch.setenv('CLERK_ISSUER', 'https://clerk.example.com')
    monkeypatch.setenv('CLERK_SECRET_KEY', 'test-secret')
    monkeypatch.setenv('CLERK_AUTHORIZED_PARTIES', 'http://localhost:5173')
    response = Mock()
    client = AsyncMock()
    client.delete.return_value = response
    context = Mock()
    context.__aenter__ = AsyncMock(return_value=client)
    context.__aexit__ = AsyncMock(return_value=None)
    monkeypatch.setattr('auth.clerk_service.httpx.AsyncClient', Mock(return_value=context))
    await ClerkService().delete_user('user_123')
    client.delete.assert_awaited_once_with(
        'https://api.clerk.com/v1/users/user_123', headers={'Authorization': 'Bearer test-secret'},
    )
    response.raise_for_status.assert_called_once_with()


def test_router_deletes_only_the_authenticated_user(monkeypatch):
    identity = JwtPayload(sub='provider_123', email='owner@example.com')
    monkeypatch.setattr(middleware, 'auth_service', SimpleNamespace(jwt_decode_w_retry=AsyncMock(return_value=identity)))
    monkeypatch.setattr(middleware.auth_helpers, 'establish_user_attendance', AsyncMock(return_value={}))
    provider_delete = AsyncMock()
    database_delete = AsyncMock()
    monkeypatch.setattr(user_router, 'auth_service', SimpleNamespace(delete_user=provider_delete))
    monkeypatch.setattr(user_router.db_handler, 'delete_user', database_delete)
    middleware.rest_rate_tracker.tracker.clear()
    client = TestClient(app)
    headers = {'Authorization': 'Bearer test'}
    assert client.delete('/api/v1/user/other@example.com', headers=headers).status_code == 403
    provider_delete.assert_not_awaited()
    database_delete.assert_not_awaited()
    assert client.delete('/api/v1/user/owner@example.com', headers=headers).status_code == 200
    provider_delete.assert_awaited_once_with('provider_123')
    database_delete.assert_awaited_once_with('owner@example.com')


def test_router_does_not_delete_database_user_if_provider_fails(monkeypatch):
    identity = JwtPayload(sub='provider_123', email='owner@example.com')
    monkeypatch.setattr(middleware, 'auth_service', SimpleNamespace(jwt_decode_w_retry=AsyncMock(return_value=identity)))
    monkeypatch.setattr(middleware.auth_helpers, 'establish_user_attendance', AsyncMock(return_value={}))
    monkeypatch.setattr(user_router, 'auth_service', SimpleNamespace(delete_user=AsyncMock(side_effect=httpx.ConnectError('offline'))))
    database_delete = AsyncMock()
    monkeypatch.setattr(user_router.db_handler, 'delete_user', database_delete)
    middleware.rest_rate_tracker.tracker.clear()
    response = TestClient(app).delete('/api/v1/user/owner@example.com', headers={'Authorization': 'Bearer test'})
    assert response.status_code == 500
    database_delete.assert_not_awaited()
