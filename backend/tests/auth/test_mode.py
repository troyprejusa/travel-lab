import os
import subprocess
import sys

import pytest

from auth.auth0_service import Auth0Service
from auth.auth_service_factory import create_auth_service
from auth.dev_auth_service import DevAuthService
from utilities import constants


@pytest.mark.parametrize(
    ('mode', 'service'),
    [
        (constants.Mode.DEVELOPMENT, DevAuthService),
        (constants.Mode.TEST, DevAuthService),
        (constants.Mode.PRODUCTION, Auth0Service),
    ],
)
def test_auth_service_matches_mode(monkeypatch, mode, service):
    monkeypatch.setattr(constants, 'MODE', mode)
    assert isinstance(create_auth_service(), service)


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
