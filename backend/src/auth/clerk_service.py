"""Verify Clerk sessions and resolve their verified primary email address."""
import asyncio
import os
from urllib.parse import quote

import httpx
import jwt

from .auth_service import AuthService, AuthServiceUnavailableError
from .models import JwtPayload


class ClerkUnavailableError(AuthServiceUnavailableError):
    """Clerk could not be reached to authenticate a request."""


class ClerkService(AuthService):
    def __init__(self):
        self.issuer = os.getenv('CLERK_ISSUER', '').rstrip('/')
        self.secret = os.getenv('CLERK_SECRET_KEY', '')
        self.authorized_parties = [
            value.strip() for value in os.getenv('CLERK_AUTHORIZED_PARTIES', '').split(',')
            if value.strip()
        ]
        if not self.issuer.startswith('https://') or not self.secret or not self.authorized_parties:
            raise RuntimeError('Set CLERK_ISSUER, CLERK_SECRET_KEY, and CLERK_AUTHORIZED_PARTIES')
        # PyJWKClient caches the JWKS for five minutes and refreshes on an unknown key ID.
        self.jwks = jwt.PyJWKClient(f'{self.issuer}/.well-known/jwks.json')

    async def delete_user(self, provider_user_id: str) -> None:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.delete(
                f'https://api.clerk.com/v1/users/{quote(provider_user_id, safe="")}',
                headers={'Authorization': f'Bearer {self.secret}'},
            )
            response.raise_for_status()

    async def get_rsa_keys(self, token: str):
        return (await asyncio.to_thread(self.jwks.get_signing_key_from_jwt, token)).key

    def decode_jwt(self, token: str, rsa_key) -> dict:
        claims = jwt.decode(
            token, rsa_key, algorithms=['RS256'], issuer=self.issuer,
            options={'require': ['exp', 'iat', 'nbf', 'sub', 'iss'], 'verify_aud': False},
        )
        if claims.get('azp') not in self.authorized_parties:
            raise jwt.InvalidTokenError('Invalid authorized party')
        if claims.get('sts') == 'pending':
            raise jwt.InvalidTokenError('Session is pending')
        if not isinstance(claims['sub'], str) or not claims['sub']:
            raise jwt.InvalidTokenError('Invalid subject')
        return claims

    async def jwt_decode_w_retry(self, token: str) -> JwtPayload:
        try:
            claims = self.decode_jwt(token, await self.get_rsa_keys(token))
        except jwt.PyJWKClientConnectionError as error:
            raise ClerkUnavailableError('Unable to retrieve Clerk signing keys') from error
        except jwt.PyJWKClientError as error:
            raise jwt.InvalidTokenError('Unable to verify Clerk session') from error

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f'https://api.clerk.com/v1/users/{quote(claims["sub"], safe="")}',
                    headers={'Authorization': f'Bearer {self.secret}'},
                )
                response.raise_for_status()
                user = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise ClerkUnavailableError('Unable to retrieve Clerk user') from error

        try:
            primary = next((item for item in user.get('email_addresses', [])
                            if item.get('id') == user.get('primary_email_address_id')
                            and item.get('verification', {}).get('status') == 'verified'), None)
            if not primary or not isinstance(primary.get('email_address'), str) or not primary['email_address']:
                raise jwt.InvalidTokenError('Verified primary email required')
            return JwtPayload(sub=claims['sub'], email=primary['email_address'])
        except (AttributeError, TypeError) as error:
            raise ClerkUnavailableError('Invalid response from Clerk') from error
