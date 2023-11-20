import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import reduxStore from './redux/Store';
import { Auth0Provider } from '@auth0/auth0-react';
import Constants from './utilities/Constants';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// Pages
import Landing from './Pages/Landing';
import Staging from './Pages/Staging';
import Trips from './Pages/Trips';
import UserSettings from './Pages/UserSettings';
import ProtectedProject from './Pages/Project';
import Home from './Pages/Home';
import Itinerary from './Pages/Itinerary';
import MessageBoard from './Pages/MessageBoard';
import Poll from './Pages/Poll';
import Packing from './Pages/Packing';
import Travellers from './Pages/Travellers';
import TripSettings from './Pages/TripSettings';
import Licenses from './Pages/Licenses';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import NotFound from './Pages/NotFound';
import ProtectedUserOutlet from './Pages/UserOutlet';
import HomeOutlet from './Pages/HomeOutlet';
import AccountSetup from './Pages/AccountSetup';
import About from './Pages/About';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomeOutlet />} >
        <Route path="" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path='about' element={<About />} />
        <Route path='privacy' element={<PrivacyPolicy />} />
        <Route path='termsandconditions' element={<TermsAndConditions />} />
        <Route path='licenses' element={<Licenses />} />
      </Route>

      <Route path="/user/:username" element={<ProtectedUserOutlet />} >
        <Route path="" element={<Staging />} />
        <Route path="setup" element={<AccountSetup />}/>
        <Route path="trips" element={<Trips />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

      <Route path="/trip/:trip_id" element={<ProtectedProject />}>
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
          }}
        >
          <RouterProvider router={router} />
        </Auth0Provider>
      </ReduxProvider>
    </ChakraProvider>
  </React.StrictMode>
);
