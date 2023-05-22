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
import NotFound from './Pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Splash />} />

      <Route path="project/:projectId" element={<Project />}>
        <Route path="itinerary" element={<h1>Im an itinerary</h1>}/>
        <Route path="calendar" element={<h1>Im a calendar</h1>}/>
        <Route path="poll" element={<h1>Im a poll</h1>}/>
        <Route path="packing" element={<h1>Im a packing list</h1>}/>
        <Route path="message" element={<h1>Im a message</h1>}/>
        <Route path="contactinfo" element={<h1>Im a message</h1>}/>
        <Route path="transportation" element={<h1>Im a merge intervals problem</h1>}/>
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
