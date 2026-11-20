import os
import subprocess
import sys

import pytest

from auth.auth0_service import Auth0Service
from auth.auth_service_factory import create_auth_service
from auth.dev_auth_service import DevAuthService
from utilities import environment


@pytest.mark.parametrize(
    ('provider', 'service'),
    [
        (environment.AuthProvider.DEVELOPMENT, DevAuthService),
        (environment.AuthProvider.AUTH0, Auth0Service),
    ],
)
def test_auth_service_matches_provider(monkeypatch, provider, service):
    monkeypatch.setattr(environment, 'MODE', environment.Mode.DEVELOPMENT)
    monkeypatch.setattr(environment, 'AUTH_PROVIDER', provider)
    assert isinstance(create_auth_service(), service)


def test_clerk_provider_is_selected(monkeypatch):
    from auth import auth_service_factory
    sentinel = object()
    monkeypatch.setattr(environment, 'AUTH_PROVIDER', environment.AuthProvider.CLERK)
    monkeypatch.setattr(auth_service_factory, 'ClerkService', lambda: sentinel)
    assert create_auth_service() is sentinel


def test_factory_rejects_development_provider_in_production(monkeypatch):
    monkeypatch.setattr(environment, 'MODE', environment.Mode.PRODUCTION)
    monkeypatch.setattr(environment, 'AUTH_PROVIDER', environment.AuthProvider.DEVELOPMENT)
    with pytest.raises(RuntimeError):
        create_auth_service()


def test_invalid_auth_provider_is_rejected_at_import():
    env = {**os.environ, 'AUTH_PROVIDER': 'invalid'}
    result = subprocess.run(
        [sys.executable, '-c', 'from utilities import environment'],
        cwd=os.path.join(os.path.dirname(__file__), '..', '..', 'src'),
        env=env, capture_output=True, text=True, check=False,
    )
    assert result.returncode != 0
    assert "'invalid' is not a valid AuthProvider" in result.stderr


def test_dev_auth_rejects_production(monkeypatch):
    monkeypatch.setattr(environment, 'MODE', environment.Mode.PRODUCTION)
    with pytest.raises(RuntimeError):
        DevAuthService()


def test_invalid_mode_is_rejected_at_import():
    env = {**os.environ, 'MODE': 'invalid'}
    result = subprocess.run(
        [sys.executable, '-c', 'from utilities import environment'],
        cwd=os.path.join(os.path.dirname(__file__), '..', '..', 'src'),
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode != 0
    assert "'invalid' is not a valid Mode" in result.stderr
