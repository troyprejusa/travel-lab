import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TripModel } from '../utilities/Interfaces';
import TripCard from '../Components/TripCard';
import fetchHelpers from '../utilities/fetchHelpers';
import TripActionCard from '../Components/TripActionCard';
import { Wrap, Flex, Button, Heading } from '@chakra-ui/react';
import { signOutBeforeTripSelect } from '../utilities/stateResets';
import { useAuth0 } from '@auth0/auth0-react';

function Trips(): JSX.Element {
  const initialTripState: Array<TripModel> = [];
  const [trips, setTrips] = useState(initialTripState);
  const dispatch = useDispatch();
  // const user: UserModel = useSelector((state: RootState) => state.user);
  // const trip: TripModel = useSelector((state: RootState) => state.trip);
  const { getAccessTokenSilently, getAccessTokenWithPopup, logout } = useAuth0();

  useEffect(getTrips, []);

  return (
    <>
      <Flex justifyContent={'flex-end'}>
        <Button margin='20px' size='md' colorScheme='red' onClick={handleSignOut}>Sign Out</Button>
      </Flex>
      <Flex justifyContent={'center'}>
        <Heading>Choose your adventure!</Heading>
      </Flex>
      <Wrap margin={'10%'} spacing={'10%'}>
        {trips.map((trip: TripModel, i: number) => (
          <TripCard key={i} tripData={trip} />
        ))}
        <TripActionCard />
      </Wrap>
    </>
  );

  function getTrips() {
    (async function () {
      try {
        console.log('About to send the request')
        const tokenHeader = await fetchHelpers.getTokenHeader(getAccessTokenSilently);
        const res: Response = await fetch(`/user/trips`, {
          method: 'GET',
          headers: tokenHeader
        });

        console.log('I sent the request!')

        if (res.ok) {
          const trips: Array<TripModel> = await res.json();
          setTrips(trips);
        } else {
          const message: any = await res.json();
          throw new Error(JSON.stringify(message));
        }
      } catch (e: any) {
        console.error(e);
      }
    })();
  }

  function handleSignOut(event: SyntheticEvent) {
    signOutBeforeTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

}

export default Trips;
