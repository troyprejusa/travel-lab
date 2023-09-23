import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { TripModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import { fetchAllTripData } from '../utilities/stateHandlers';

function Project(): JSX.Element {
  const dispatch = useDispatch();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { getAccessTokenSilently } = useAuth0();

  // Fetch all data for this project only on page load
  useEffect(() => {
    setTripData();
  }, []);

  return (
    <>
      <Navbar>
        <Outlet />
      </Navbar>
    </>
  );

  async function setTripData() {
    const token: string = await fetchHelpers.getAuth0Token(
      getAccessTokenSilently
    );
    fetchAllTripData(trip.id, token, dispatch)
  }
}

export default Project;
