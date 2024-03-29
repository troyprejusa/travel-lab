from fastapi import Request, HTTPException
from fastapi.responses import FileResponse
from . import Constants, auth_helpers
from .RateTracker import RateTracker
from .UtilitiesLogger import utilities_logger
import json
import jwt

# GLOBAL VARIABLES (BELOW)
rest_rate_tracker = RateTracker(Constants.API_REQUEST_COUNT, Constants.API_REQUESTS_WINDOW)

'''
 Require authentication for the following endpoint roots (/api, /test, etc.)

 NOTE: Switched from a whitelist to a blacklist because we need unrecognized 
 endpoints to continue to the default route handler to manage client fwd/back/refresh
 '''
auth_list = set([
    'api',
])

reserved_files = set([
    'docs',
    'openapi.json'
])

with open('/app/src/dist/third-party-licenses.json', 'r') as license_file:
    license_data = json.load(license_file)
# GLOBAL VARIABLES (ABOVE)

async def rate_limiter(request: Request, call_next):
    # It is okay to use request.client.host as long as the request is not 
    # proxied. Heroku is a router, not a proxy, so either is ok
    user_ip = request.headers.get('x-forwarded-for') or request.client.host
    ok = rest_rate_tracker.add_entry(user_ip)
    
    if not ok:
        raise HTTPException(
            status_code=429,
            detail={
                "message": "This user has submitted too many requests"
            }
        )
    
    utilities_logger.debug(json.dumps({
        'client': user_ip, 
        'usage_ratio': len(rest_rate_tracker.tracker[user_ip]) / Constants.API_REQUESTS_WINDOW
    }))
    
    response = await call_next(request)
    return response

async def serve_static_files(request: Request, call_next):
    if request.method == 'GET':
        # Handle edge case
        if (request.url.path == '/'):
            return FileResponse('/app/src/dist/index.html')
        
        endpoint_array = request.url.path[1:].split('/')

        # /<filename>
        if len(endpoint_array) == 1 and endpoint_array[0] not in reserved_files:
            return FileResponse(f'/app/src/dist/{endpoint_array[0]}')
        
        # /assets/<filename>
        if len(endpoint_array) == 2 and endpoint_array[0] == 'assets':
            # Vite includes hashes in the filename for this directory,
            # so they are OK for "permanent" caching (1 year) 
            cache_headers = {
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
            return FileResponse(f'/app/src/dist/assets/{endpoint_array[1]}', headers=cache_headers)
            
    response = await call_next(request)
    return response

async def authenticate_user(request: Request, call_next):
    utilities_logger.debug(f'HTTP request to {request.url.path}')

    root_path = request.url.path.split('/')[1]

    if root_path not in auth_list:
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
            request.state.user['trips'] = await auth_helpers.establish_user_attendance(user_email)

            response = await call_next(request)
            
            return response
        
        except (jwt.exceptions.InvalidTokenError, KeyError) as error:
            utilities_logger.warning(f'Authentication error:\n{request.url.path}\n{error}')
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Authentication required"
                }
            )
