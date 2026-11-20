from unittest.mock import AsyncMock

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa

from auth.clerk_service import ClerkService, ClerkSettings


@pytest.fixture
def clerk(monkeypatch):
    monkeypatch.setenv('CLERK_ISSUER', 'https://clerk.example.com')
    monkeypatch.setenv('CLERK_SECRET_KEY', 'test-secret')
    monkeypatch.setenv('CLERK_AUTHORIZED_PARTIES', 'http://localhost:5173')
    return ClerkService(ClerkSettings())


def test_clerk_verifies_signature_issuer_and_authorized_party(clerk):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    claims = {'sub': 'user_123', 'iss': clerk.issuer, 'azp': 'http://localhost:5173',
              'iat': 1, 'nbf': 1, 'exp': 4102444800}
    token = jwt.encode(claims, key, algorithm='RS256')
    assert clerk.decode_jwt(token, key.public_key())['sub'] == 'user_123'
    claims['azp'] = 'https://other.example.com'
    with pytest.raises(jwt.InvalidTokenError):
        clerk.decode_jwt(jwt.encode(claims, key, algorithm='RS256'), key.public_key())
    claims['iss'] = 'https://other.example.com'
    with pytest.raises(jwt.InvalidTokenError):
        clerk.decode_jwt(jwt.encode(claims, key, algorithm='RS256'), key.public_key())


@pytest.mark.asyncio
async def test_clerk_rejects_unverified_primary_email(clerk, monkeypatch):
    monkeypatch.setattr(clerk, 'get_rsa_keys', AsyncMock(return_value='key'))
    monkeypatch.setattr(clerk, 'decode_jwt', lambda *_: {'sub': 'user_123'})

    class Response:
        def raise_for_status(self): pass
        def json(self):
            return {'primary_email_address_id': 'email_1', 'email_addresses': [
                {'id': 'email_1', 'email_address': 'user@example.com', 'verification': {'status': 'unverified'}}]}

    class Client:
        def __init__(self, **kwargs): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def get(self, *args, **kwargs): return Response()

    monkeypatch.setattr('auth.clerk_service.httpx.AsyncClient', Client)
    with pytest.raises(jwt.InvalidTokenError):
        await clerk.jwt_decode_w_retry('token')


def test_clerk_rejects_pending_sessions(clerk):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    claims = {'sub': 'user_123', 'iss': clerk.issuer, 'azp': 'http://localhost:5173',
              'iat': 1, 'nbf': 1, 'exp': 4102444800, 'sts': 'pending'}
    with pytest.raises(jwt.InvalidTokenError, match='pending'):
        clerk.decode_jwt(jwt.encode(claims, key, algorithm='RS256'), key.public_key())


@pytest.mark.asyncio
async def test_clerk_returns_verified_primary_email(clerk, monkeypatch):
    monkeypatch.setattr(clerk, 'get_rsa_keys', AsyncMock(return_value='key'))
    monkeypatch.setattr(clerk, 'decode_jwt', lambda *_: {'sub': 'user_123'})

    class Response:
        def raise_for_status(self): pass
        def json(self):
            return {'primary_email_address_id': 'primary', 'email_addresses': [
                {'id': 'other', 'email_address': 'other@example.com', 'verification': {'status': 'verified'}},
                {'id': 'primary', 'email_address': 'user@example.com', 'verification': {'status': 'verified'}},
            ]}

    class Client:
        def __init__(self, **kwargs): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def get(self, url, headers):
            assert url == 'https://api.clerk.com/v1/users/user_123'
            assert headers == {'Authorization': 'Bearer test-secret'}
            return Response()

    monkeypatch.setattr('auth.clerk_service.httpx.AsyncClient', Client)
    user = await clerk.jwt_decode_w_retry('token')
    assert (user.sub, user.email) == ('user_123', 'user@example.com')


@pytest.mark.asyncio
async def test_clerk_key_service_outage_is_not_invalid_token(clerk, monkeypatch):
    from auth.clerk_service import ClerkUnavailableError

    monkeypatch.setattr(clerk, 'get_rsa_keys', AsyncMock(side_effect=jwt.PyJWKClientConnectionError('offline')))
    with pytest.raises(ClerkUnavailableError):
        await clerk.jwt_decode_w_retry('token')
