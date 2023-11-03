from fastapi import Request, HTTPException
from fastapi.responses import FileResponse
from utilities import auth_helpers
from utilities import Constants
import jwt
from collections import deque
import time
from utilities import Constants


class RateTracker:
    def __init__(self, request_count: int, request_window: int):
        self.tracker = {}
        self.request_count = request_count
        self.request_window = request_window

    def add_entry(self, id) -> bool:
        tracker = self.tracker  # Alias for convenience

        if id not in tracker:
            tracker[id] = deque()

        user_record = tracker[id]
        
        now = time.monotonic()

        user_record.append(now)

        # Trim the list for the last N seconds
        while now - user_record[0] > self.request_window:
            user_record.popleft()

        if len(user_record) >self.request_count:
            return False
        
        return True
    
    # TODO: Add periodic cleanup for this data structure


rest_rate_tracker = RateTracker(Constants.API_REQUEST_COUNT, Constants.API_REQUESTS_WINDOW)

async def rate_limiter(request: Request, call_next):
    ok = rest_rate_tracker.add_entry(request.client.host)
    
    if not ok:
        raise HTTPException(
            status_code=429,
            detail={
                "message": "This user has submitted too many requests"
            }
        )
    
    # print({
    #     'CLIENT': request.client.host, 
    #     'RATE': len(rest_rate_tracker.tracker[request.client.host]) / Constants.API_REQUESTS_WINDOW
    #     })
        
    response = await call_next(request)
    return response

# Allow non-authenticated access to the following endpoints
# The logic is such that these represent calls to /docs, /openapi.json,
whitelist = set([
    '',
    'assets',
    'dev',
    'sio',
    'docs',
    'openapi.json'
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
            # Expecting AUTHORIZATION: BEARER <token>
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
        
        except (jwt.exceptions.InvalidTokenError, KeyError) as error:
            print(f'authenticate_user: Invalid authentication:\n{request.url.path}\n{error}')
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Authentication required"
                }
            )

async def serve_public(request: Request, call_next):
    if request.method == 'GET':
        match request.url.path:
            case '/':
                return FileResponse('/app/dist/index.html')
            case '/index.html':
                return FileResponse('/app/dist/index.html')
            case '/robots.txt':
                return FileResponse('/app/dist/robots.txt')
            case '/vite.svg':
                return FileResponse('/app/dist/vite.svg')
            case _:
                return await call_next(request)
    else:
        return await call_next(request)
