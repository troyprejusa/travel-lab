# Frontend Architecture

This is a proposed route map for the current backend. A route is a browser URL; it is separate from an API endpoint. Create, edit, and confirmation forms can live in dialogs on their parent page unless they need their own shareable URL.

## Public

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Landing | Introduce Travel Lab and link to login. |
| `/login` | Login | Request a magic link and show the pending/error states. The current screen at `/sign-in` is a mockup and will move to `/login`. |

## Signed in

| Route | Page | Backend functionality |
| --- | --- | --- |
| `/trips` | My trips | List the user's trips; create a trip or request to join one by ID in a dialog. |
| `/trips/:tripId` | Trip overview / travel info | Show the trip's destination, dates, description, type, and a summary of its planning sections. |
| `/trips/:tripId/itinerary` | Itinerary | List, add, and delete itinerary stops. |
| `/trips/:tripId/packing` | Packing | List and add items, claim or unclaim them, and delete items. |
| `/trips/:tripId/polls` | Polls | List, create, vote on, and delete polls. |
| `/trips/:tripId/messages` | Messages | Read and send trip messages; clear the message history. |
| `/trips/:tripId/travellers` | Travellers | List travellers and pending requests; accept or remove travellers. |
| `/trips/:tripId/settings` | Trip settings | Show trip permissions, leave the trip, or delete it. |
| `/settings` | Account settings | Complete or update name and phone; delete the account. User creation/upsert happens after authentication. |

That is **11 application routes**: two public and nine signed-in. Add a wildcard not-found page as a twelfth route. A separate authentication callback route may also be needed, depending on the magic-link provider; that choice is not implemented yet. Layouts, dialogs, loading states, and error states do not need their own routes.

## Access and behavior

- Use React Router with a public layout and a signed-in layout. A trip layout can provide shared navigation and load trip permissions for the seven `/trips/:tripId` pages.
- Redirect signed-out visitors from protected pages to `/login`, preserving their intended destination for after login. Handle unknown trips, denied access, expired sessions, loading, and errors explicitly.
- Trip access depends on membership; admin-only controls include deleting a trip, itinerary stop, poll, packing item, or all messages, and accepting or removing travellers. Hiding controls is only a UI convenience: the backend must enforce authorization.
- Initial lists come from REST. The backend also exposes Socket.IO namespaces for itinerary, polls, packing, and messages; poll voting and sending messages currently use socket events. Decide per action whether to use REST or sockets so an action is not submitted twice.

## Backend gaps to resolve before integration

- Magic-link delivery and its callback are not provided by these API routers. The backend validates Auth0 tokens (or seeded development identities); the sign-in provider and callback flow still need to be chosen and connected.
- There is no dedicated `GET /trip/:tripId` or trip update endpoint in the current router. The overview can derive trip details from the user's trip list initially; editing trip details requires backend work.
- The Socket.IO handlers currently validate a token on connect but do not visibly enforce trip membership or admin permissions for events, and some event payloads supply the acting user. Backend authorization must be addressed before relying on these actions. The packing unclaim handler also emits the claim event name; confirm the event contract during integration.
- When FastAPI serves the built frontend, its static-file middleware treats single-segment paths as files. Verify and fix direct navigation/refresh for routes such as `/login`, `/trips`, and `/settings` when connecting the router.

## Frontend configuration and authentication

`src/constants.ts` holds browser configuration. Vite's built-in mode determines the auth service: the Vite development server uses the seeded development identity, while production builds use the unconnected magic-link service. A development login sends `Bearer troy@test.com` to the backend's user upsert endpoint, then retains the development session in the browser tab and uses that token for API calls. Sign-out clears it. The backend must also run in development mode for this token to work.

The magic-link service is a stub: it cannot send email or authenticate users yet. `src/lib/api.ts` adds the active token to API requests. The `/trips` screen is a minimal integration placeholder; the remaining routes above are still planned.

Vite loads `.env` and mode-specific files such as `.env.test`. Custom variables exposed to frontend code must start with `VITE_` and are embedded in the client bundle, so they must not contain secrets. No custom environment variables are required by the current frontend. Mode-specific files are selected with Vite's `--mode` option; changing mode alone does not enable development auth in a production build.
