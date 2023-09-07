import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import reduxStore from './redux/Store';
import { Auth0Provider } from '@auth0/auth0-react';
import Constants from './utilities/Constants';

// Pages
import Splash from './Pages/Splash';
import Staging from './Pages/Staging';
import Trips from './Pages/Trips';
import UserSettings from './Pages/UserSettings';
import Project from './Pages/Project';
import Home from './Pages/Home';
import Itinerary from './Pages/Itinerary';
import MessageBoard from './Pages/MessageBoard';
import Poll from './Pages/Poll';
import Packing from './Pages/Packing';
import Travellers from './Pages/Travellers';
import TripSettings from './Pages/TripSettings';
import NotFound from './Pages/NotFound';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Splash />} />

      <Route path="/user/:username" element={<Staging />}/>
      <Route path="/user/:username/trips" element={<Trips />} />
      <Route path="/user/:username/settings" element={<UserSettings />} />

      <Route path="/trip/:trip_id" element={<Project />}>
        <Route path="home" element={<Home />} />
        <Route path="itinerary" element={<Itinerary />} />
        <Route path="message" element={<MessageBoard />} />
        <Route path="poll" element={<Poll />} />
        <Route path="packing" element={<Packing />} />
        <Route path="travellers" element={<Travellers />} />
        <Route path="settings" element={<TripSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ReduxProvider store={reduxStore}>
        <Auth0Provider
          domain={Constants.AUTH0_DOMAIN}
          clientId={Constants.AUTH0_CLIENT}
          
          useRefreshTokens={true}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: Constants.AUTH0_AUDIENCE,
            // scope: 'openid profile email offline_access',
          }}
        >
          <RouterProvider router={router} />
        </Auth0Provider>
      </ReduxProvider>
    </ChakraProvider>
  </React.StrictMode>
);
