import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { TripModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { reduxFetchTravellers } from '../redux/TravellersSlice';
import { reduxFetchItinerary } from '../redux/ItinerarySlice';
import { reduxFetchMessages } from '../redux/MessageSlice';
import { reduxFetchPolls } from '../redux/PollSlice';
import { reduxFetchPacking } from '../redux/PackingSlice';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';

function Project(): JSX.Element {
  const dispatch = useDispatch();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { getAccessTokenSilently } = useAuth0();

  // Fetch all data for this project on project load
  useEffect(() => {fetchAllTripData()}, []);

  return (
    <>
      <Navbar>
        <Box>
          <Outlet />
        </Box>
      </Navbar>
    </>
  );

  async function fetchAllTripData() {
    const token: string = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
    dispatch(reduxFetchTravellers({trip_id: trip.id, token: token}));
    dispatch(reduxFetchItinerary({trip_id: trip.id, token: token}));
    dispatch(reduxFetchMessages({trip_id: trip.id, token: token}));
    dispatch(reduxFetchPolls({trip_id: trip.id, token: token}));
    dispatch(reduxFetchPacking({trip_id: trip.id, token: token}));
  }
}

export default Project;
