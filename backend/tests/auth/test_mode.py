import os
import subprocess
import sys

import pytest

from auth.auth0_service import Auth0Service
from auth.auth_service_factory import create_auth_service
from auth.dev_auth_service import DevAuthService
from utilities import constants


@pytest.mark.parametrize(
    ('provider', 'service'),
    [
        (constants.AuthProvider.DEVELOPMENT, DevAuthService),
        (constants.AuthProvider.AUTH0, Auth0Service),
    ],
)
def test_auth_service_matches_provider(monkeypatch, provider, service):
    monkeypatch.setattr(constants, 'MODE', constants.Mode.DEVELOPMENT)
    monkeypatch.setattr(constants, 'AUTH_PROVIDER', provider)
    assert isinstance(create_auth_service(), service)


def test_clerk_provider_is_selected(monkeypatch):
    from auth import auth_service_factory
    sentinel = object()
    monkeypatch.setattr(constants, 'AUTH_PROVIDER', constants.AuthProvider.CLERK)
    monkeypatch.setattr(auth_service_factory, 'ClerkService', lambda: sentinel)
    assert create_auth_service() is sentinel


def test_factory_rejects_development_provider_in_production(monkeypatch):
    monkeypatch.setattr(constants, 'MODE', constants.Mode.PRODUCTION)
    monkeypatch.setattr(constants, 'AUTH_PROVIDER', constants.AuthProvider.DEVELOPMENT)
    with pytest.raises(RuntimeError):
        create_auth_service()


def test_invalid_auth_provider_is_rejected_at_import():
    env = {**os.environ, 'AUTH_PROVIDER': 'invalid'}
    result = subprocess.run(
        [sys.executable, '-c', 'from utilities import constants'],
        cwd=os.path.join(os.path.dirname(__file__), '..', '..', 'src'),
        env=env, capture_output=True, text=True, check=False,
    )
    assert result.returncode != 0
    assert "'invalid' is not a valid AuthProvider" in result.stderr


def test_dev_auth_rejects_production(monkeypatch):
    monkeypatch.setattr(constants, 'MODE', constants.Mode.PRODUCTION)
    with pytest.raises(RuntimeError):
        DevAuthService()


def test_invalid_mode_is_rejected_at_import():
    env = {**os.environ, 'MODE': 'invalid'}
    result = subprocess.run(
        [sys.executable, '-c', 'from utilities import constants'],
        cwd=os.path.join(os.path.dirname(__file__), '..', '..', 'src'),
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode != 0
    assert "'invalid' is not a valid Mode" in result.stderr
