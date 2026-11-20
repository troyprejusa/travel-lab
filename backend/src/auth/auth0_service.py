import asyncio

import jwt
from jwt import PyJWKClient
from pydantic import SecretStr, ValidationError, model_validator
from pydantic_settings import SettingsConfigDict
from auth0.authentication import GetToken
from auth0.management import Auth0

from .auth_service import AuthSettings, AuthService
from .models import JwtPayload

class Auth0Settings(AuthSettings):
    model_config = SettingsConfigDict(env_prefix='AUTH0_')

    domain: str
    audience: str
    algorithm: str
    claim_namespace: str
    client_id: str
    client_secret: SecretStr


class Auth0Service(AuthService):
    def __init__(self, config: Auth0Settings):
        self.key_cache = {}
        self.domain = config.domain
        self.audience = config.audience
        self.algorithms = [config.algorithm]
        self.claim_namespace = config.claim_namespace
        self.client_id = config.client_id
        self.client_secret = config.client_secret.get_secret_value()

    def get_manager(self):
        get_token = GetToken(self.domain, self.client_id, client_secret=self.client_secret)
        token = get_token.client_credentials(f'https://{self.domain}/api/v2/')
        return Auth0(self.domain, token['access_token'])

    async def delete_user(self, provider_user_id: str) -> None:
        def delete():
            self.get_manager().users.delete(provider_user_id)

        await asyncio.to_thread(delete)

    async def jwt_decode_w_retry(self, token: str) -> JwtPayload:
        key_id = jwt.get_unverified_header(token)['kid']
        if key_id in self.key_cache:
            try:
                rsa_key = self.key_cache[key_id]
                payload = self.decode_jwt(token, rsa_key)
            except jwt.exceptions.InvalidTokenError:
                # Retry with updated keys
                self.key_cache.pop(key_id)
                rsa_key = await self.get_rsa_keys(token)
                payload = self.decode_jwt(token, rsa_key)

        else:
            rsa_key = await self.get_rsa_keys(token)
            payload = self.decode_jwt(token, rsa_key)

        return payload


    async def get_rsa_keys(self, token: str) -> dict:
        url = f"https://{self.domain}/.well-known/jwks.json"
        jwks_client = PyJWKClient(url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        rsa_key = signing_key.key
        
        # Cache the key for subsequent tokens
        key_id = jwt.get_unverified_header(token)['kid']
        self.key_cache[key_id] = rsa_key

        # Return key as well, for convenience
        return rsa_key


    def decode_jwt(self, token: str, rsa_key) -> JwtPayload:
        claims = jwt.decode(
            token,
            key=rsa_key,
            algorithms=self.algorithms,
            audience=self.audience,
            issuer=f"https://{self.domain}/",
        )
        email_claim = f'{self.claim_namespace}/email'
        try:
            return JwtPayload.model_validate({**claims, 'email': claims.get(email_claim)})
        except ValidationError as error:
            raise jwt.InvalidTokenError('Token is missing valid identity claims') from error
