import jwt
from jwt import PyJWKClient

from utilities import constants
from .auth_service import AuthService


class Auth0Service(AuthService):
    def __init__(self):
        self.key_cache = {}

    async def jwt_decode_w_retry(self, token: str) -> dict:
        payload = {}
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
        url = f"https://{constants.AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks_client = PyJWKClient(url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        rsa_key = signing_key.key
        
        # Cache the key for subsequent tokens
        key_id = jwt.get_unverified_header(token)['kid']
        self.key_cache[key_id] = rsa_key

        # Return key as well, for convenience
        return rsa_key


    def decode_jwt(self, token: str, rsa_key) -> dict:
        return jwt.decode(
        token,
        key=rsa_key,
        algorithms=constants.AUTH0_ALGORITHM,
        audience=constants.AUTH0_AUDIENCE,
        issuer=f"https://{constants.AUTH0_DOMAIN}/",
        )
