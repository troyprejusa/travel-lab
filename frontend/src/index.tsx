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

// Pages
import Splash from './Pages/Splash';
import Project from './Pages/Project';
import Itinerary from './Pages/Itinerary';
import Calendar from './Pages/Calendar';
import Poll from './Pages/Poll';
import Transportation from './Pages/Transportation';
import MessageBoard from './Pages/MessageBoard';
import Packing from './Pages/Packing';
import ContactInfo from './Pages/ContactInfo';
import NotFound from './Pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Splash />} />

      <Route path="project/:projectId" element={<Project />}>
        <Route path="itinerary" element={<Itinerary />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="poll" element={<Poll />}/>
        <Route path="transportation" element={<Transportation />} />
        <Route path="message" element={<MessageBoard />}/>
        <Route path="packing" element={<Packing />} />
        <Route path="contactinfo" element={<ContactInfo />} />
        <Route />
      </Route>

      <Route path='*' element={<NotFound />} />
    </>

  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
