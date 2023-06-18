import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider} from 'react-redux';
import reduxStore from './redux/Store';

// Pages
import Splash from './Pages/Splash';
import Trips from './Pages/Trips';
import UserSettings from './Pages/UserSettings';
import Project from './Pages/Project';
import Home from './Pages/Home';
import Itinerary from './Pages/Itinerary';
import Calendar from './Pages/Calendar';
import Transportation from './Pages/Transportation';
import MessageBoard from './Pages/MessageBoard';
import Poll from './Pages/Poll';
import Packing from './Pages/Packing';
import ContactInfo from './Pages/ContactInfo';
import TripSettings from './Pages/TripSettings';
import NotFound from './Pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Splash />} />

      <Route path="/user/:username/trips" element={<Trips />}/>
      <Route path="/user/:username/settings" element={<UserSettings />}/>

      <Route path="/trip/:tripname" element={<Project />}>
          <Route path="home" element={<Home />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="transportation" element={<Transportation />} />
          <Route path="message" element={<MessageBoard />}/>
          <Route path="poll" element={<Poll />}/>
          <Route path="packing" element={<Packing />} />
          <Route path="contactinfo" element={<ContactInfo />} />
          <Route path="settings" element={<TripSettings />} />
      </Route>

      <Route path='*' element={<NotFound />} />
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
          <RouterProvider router={router} />
        </ReduxProvider>
      </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
