from unittest.mock import Mock

from auth.auth0_service import Auth0Service, Auth0Settings


def test_auth0_service_loads_its_configuration(monkeypatch):
    values = {
        'DOMAIN': 'example.auth0.com',
        'AUDIENCE': 'travel-api',
        'ALGORITHM': 'RS256',
        'CLAIM_NAMESPACE': 'https://example.com',
        'CLIENT_ID': 'client-id',
        'CLIENT_SECRET': 'client-secret',
    }
    for name, value in values.items():
        monkeypatch.setenv(f'AUTH0_{name}', value)
    service = Auth0Service(Auth0Settings())
    assert (service.domain, service.audience, service.algorithms, service.claim_namespace) == (
        values['DOMAIN'], values['AUDIENCE'], [values['ALGORITHM']], values['CLAIM_NAMESPACE'],
    )
    get_token = Mock()
    get_token.return_value.client_credentials.return_value = {'access_token': 'management-token'}
    manager = Mock()
    monkeypatch.setattr('auth.auth0_service.GetToken', get_token)
    monkeypatch.setattr('auth.auth0_service.Auth0', manager)
    assert service.get_manager() is manager.return_value
    get_token.assert_called_once_with(values['DOMAIN'], values['CLIENT_ID'], client_secret=values['CLIENT_SECRET'])
    get_token.return_value.client_credentials.assert_called_once_with('https://example.auth0.com/api/v2/')
    manager.assert_called_once_with(values['DOMAIN'], 'management-token')
