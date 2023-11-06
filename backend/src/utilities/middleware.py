from fastapi import Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from utilities import auth_helpers
from utilities import Constants
import jwt
from utilities import Constants
from utilities.RateTracker import RateTracker
import json

# GLOBAL VARIABLES (BELOW)
rest_rate_tracker = RateTracker(Constants.API_REQUEST_COUNT, Constants.API_REQUESTS_WINDOW)

# Allow non-authenticated access to the following endpoints (/docs, /openapi.json, ...)
whitelist = set([
    'dev',
    'sio',
    'docs',
    'openapi.json'
])

with open('/app/dist/third-party-licenses.json', 'r') as license_file:
    license_data = json.load(license_file)
# GLOBAL VARIABLES (ABOVE)

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

async def serve_static_files(request: Request, call_next):
    if request.method == 'GET':
        endpoint_array = request.url.path[1:].split('/')

        # Edge case
        if (request.url.path == '/'):
            return FileResponse('/app/dist/index.html')

        # Other cases
        if len(endpoint_array) == 1:
            # /<filename>
            return FileResponse(f'/app/dist/{endpoint_array[0]}')
        elif len(endpoint_array) == 2 and endpoint_array[0] == 'assets':
            # /assets/<filename>

            # Vite includes hashes in the filename for this directory,
            # so they are OK for permanent caching (1 year) 
            cache_headers = {
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
            return FileResponse(f'/app/dist/assets/{endpoint_array[1]}', headers=cache_headers)
            
    response = await call_next(request)
    return response

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
            auth0_id = decoded_jwt['sub']


            # Get the user's real-time trip attendance and permissions
            request.state.user = {}
            request.state.user['email'] = user_email
            request.state.user['auth0_id'] = auth0_id
            request.state.user['trips'] = auth_helpers.establish_user_attendance(user_email)

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
