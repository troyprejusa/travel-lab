# Frontend Architecture

This is the route plan for the current backend. Routes are browser URLs, separate from API endpoints. Create forms and confirmations can be dialogs on their parent page.

## Pages

The plan remains **11 application pages**: two public and nine signed-in. The landing page is a mockup, login has a working development path, and My trips is a partial integration. The other eight pages now have navigable placeholders. A not-found page is in place; a production auth callback may require another route.

| Route | Page | Status and remaining work |
| --- | --- | --- |
| `/` | Landing | Mockup exists; connect its signed-in navigation to the eventual app layout. |
| `/login` | Login | Development sign-in works; production magic-link UI is a stub. `/sign-in` redirects to `/login`. |
| `/trips` | My trips | Partial: loads trips and supports sign-out. Add loading and empty states, navigation into a trip, and create/join dialogs. |
| `/trips/:tripId` | Trip overview / travel info | Placeholder: show destination, dates, description, type, and planning summaries. |
| `/trips/:tripId/itinerary` | Itinerary | Placeholder: list, add, and delete stops. |
| `/trips/:tripId/packing` | Packing | Placeholder: list and add items, claim or unclaim them, and delete items. |
| `/trips/:tripId/polls` | Polls | Placeholder: list, create, vote on, and delete polls. |
| `/trips/:tripId/messages` | Messages | Placeholder: read and send messages; clear the history. |
| `/trips/:tripId/travellers` | Travellers | Placeholder: list travellers and requests; accept or remove travellers. |
| `/trips/:tripId/settings` | Trip settings | Placeholder: show permissions, leave the trip, or delete it. |
| `/settings` | Account settings | Placeholder: update name and phone, and delete the account. |

## Authentication and configuration

- `src/constants.ts` holds browser configuration. The Vite development server selects the development auth service; production builds select the magic-link stub. The backend must also run in development mode to accept the test identity.
- Development login sends `Bearer troy@test.com` to the user upsert endpoint. On success it stores a tab-scoped session marker; `src/lib/api.ts` attaches the token to subsequent API requests. Sign-out clears the marker. This flow has been tested against a mock backend, not yet end-to-end against the real one.
- Production magic-link delivery, callback handling, token acquisition and renewal, session restoration, and sign-out are not implemented. The backend validates Auth0 tokens, but the provider and frontend integration need to be chosen and connected. Upsert the user after successful production authentication.
- Vite loads `.env` and mode-specific files such as `.env.test`. Custom frontend variables must start with `VITE_` and are visible in the client bundle; never put secrets there. No custom frontend variables are required currently. `--mode` selects the env file but does not turn development auth on in a production build.

## Routing and shared UI gaps

- React Router defines the route tree in `App.tsx`; shared header and footer components wrap the pages, and a trip layout provides section navigation. Unknown routes show a not-found page.
- Protected routes redirect signed-out visitors to `/login` and preserve the intended destination. Handle expired sessions and access errors when production authentication is connected.
- Load trip permissions in the trip layout and show appropriate controls. Trip membership and admin permissions must be enforced by the backend, not only by the UI. Admin actions include deleting a trip, itinerary stop, poll, packing item, or all messages, and accepting or removing travellers.
- Add consistent loading, empty, validation, and error states. The trip list distinguishes loading, empty, and error states.

## Backend integration gaps

- Initial lists can come from REST. Socket.IO namespaces exist for itinerary, polls, packing, and messages; voting and sending messages currently use socket events. Choose one submission path per action to avoid duplicates, and handle reconnects and errors.
- Socket handlers validate a token on connect but do not visibly enforce trip membership or admin permissions for events, and some payloads supply the acting user. Backend authorization must be addressed before relying on these actions. The packing unclaim handler emits the claim event name; confirm or fix that contract.
- There is no dedicated trip-detail GET or trip-update endpoint in the current router. The overview can derive details from the user's trip list initially; editing those details requires backend work.
- When FastAPI serves the built frontend, its static-file middleware treats single-segment paths as files. Fix and verify direct navigation and refresh for paths such as `/login`, `/trips`, and `/settings` when connecting the router.
