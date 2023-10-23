from fastapi import Request, HTTPException
from utilities import auth_helpers
from utilities import Constants
import jwt
from collections import deque
import time
from utilities import Constants

rate_tracker = {}

async def rate_limiter(request: Request, call_next):
    if request.client.host not in rate_tracker:
        rate_tracker[request.client.host] = deque()

    user_record = rate_tracker[request.client.host]
    
    now = time.monotonic()

    user_record.append(now)

    # Trim the list for the last N seconds
    while now - user_record[0] > Constants.API_REQUESTS_WINDOW:
        user_record.popleft()

    if len(user_record) > Constants.API_REQUEST_COUNT:
        raise HTTPException(
            status_code=429,
            detail={
                "message": "This user has submitted too many requests"
            }
        )
    
    print('RATE:', len(user_record) / Constants.API_REQUESTS_WINDOW)
    
    response = await call_next(request)
    return response

# Allow non-authenticated access to the following endpoints:
whitelist = set([
    'docs',
    'openapi.json',
    'dev',
    'sio'
])

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
