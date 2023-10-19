from fastapi import Request, HTTPException
from utilities import auth_helpers
from utilities import Constants
import jwt


whitelist = set([
    'docs',
    'openapi.json',
    'dev',
    'sio'
])

# Global variable
rate_tracker = {}


async def authenticate_user(request: Request, call_next):
    # print('HTTP Request:', request.url.path)
    root_path = request.url.path.split('/')[1]

    if root_path in whitelist:
        # Bypass JWT verification
        response = await call_next(request)
        return response
    
    else:
        try:
            # Authenticate by verifying JWT before proceeding with path operations
            # Expecting "BEARER <token>"
            auth_header = request.headers['authorization'].split()

            if (auth_header[0].lower() != 'bearer'):
                raise KeyError('No bearer header')
            
            # Decode the JWT and add it to the request state - no exception on decode means we're good to proceed
            decoded_jwt = await auth_helpers.jwt_decode_w_retry(auth_header[1])
            user_email = decoded_jwt[f'{Constants.AUTH0_CLAIM_NAMESPACE}/email']

            # Get the user's real-time trip attendance and permissions
            request.state.user = auth_helpers.establish_user_attendance(user_email)

            response = await call_next(request)
            
            return response
        
        except jwt.exceptions.InvalidTokenError as token_error:
            # Invalid JWT
            print('authenticate_user: Invalid JWT\n', token_error)
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Authentication required"
                }
            )
        
async def rate_limiter(request: Request, call_next):
    print("TROY:", request.url)
    response = await call_next(request)
    return response