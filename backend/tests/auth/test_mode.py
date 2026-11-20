import os
import subprocess
import sys

import pytest

from auth.auth0_service import Auth0Service, Auth0Settings
from auth.auth_service_factory import build_auth_config, create_auth_service
from auth.clerk_service import ClerkService, ClerkSettings
from auth.dev_auth_service import DevAuthService, DevelopmentAuthConfig
from defaults import config
from utilities.enums import AuthProvider, Mode


@pytest.mark.parametrize(
    ('provider', 'settings_type', 'service_type'),
    [
        (AuthProvider.DEVELOPMENT, DevelopmentAuthConfig, DevAuthService),
        (AuthProvider.AUTH0, Auth0Settings, Auth0Service),
        (AuthProvider.CLERK, ClerkSettings, ClerkService),
    ],
)
def test_auth_service_matches_provider(monkeypatch, provider, settings_type, service_type):
    monkeypatch.setenv('CLERK_ISSUER', 'https://clerk.example.com')
    monkeypatch.setenv('CLERK_SECRET_KEY', 'test-secret')
    monkeypatch.setenv('CLERK_AUTHORIZED_PARTIES', 'http://localhost:5173')
    for name in ('DOMAIN', 'AUDIENCE', 'ALGORITHM', 'CLAIM_NAMESPACE', 'CLIENT_ID', 'CLIENT_SECRET'):
        monkeypatch.setenv(f'AUTH0_{name}', 'test-value')
    auth_config = build_auth_config(provider)
    assert isinstance(auth_config, settings_type)
    selected = config.model_copy(update={'mode': Mode.DEVELOPMENT, 'auth_provider': provider, 'auth_config': auth_config})
    assert isinstance(create_auth_service(selected), service_type)


def test_factory_rejects_development_provider_in_production():
    selected = config.model_copy(update={
        'mode': Mode.PRODUCTION,
        'auth_provider': AuthProvider.DEVELOPMENT,
        'auth_config': DevelopmentAuthConfig(),
    })
    with pytest.raises(RuntimeError):
        create_auth_service(selected)


def test_factory_rejects_mismatched_provider_settings():
    selected = config.model_copy(update={
        'auth_provider': AuthProvider.AUTH0,
        'auth_config': DevelopmentAuthConfig(),
    })
    with pytest.raises(ValueError, match='do not match'):
        create_auth_service(selected)


def test_invalid_auth_provider_is_rejected_at_import():
    env = {**os.environ, 'AUTH_PROVIDER': 'invalid'}
    result = subprocess.run(
        [sys.executable, '-c', 'from utilities import environment'],
        cwd=os.path.join(os.path.dirname(__file__), '..', '..', 'src'),
        env=env, capture_output=True, text=True, check=False,
    )
    assert result.returncode != 0
    assert "'invalid' is not a valid AuthProvider" in result.stderr


def test_dev_auth_rejects_production():
    with pytest.raises(RuntimeError):
        DevAuthService(Mode.PRODUCTION)


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
