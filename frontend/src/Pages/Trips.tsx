import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TripModel } from '../utilities/Interfaces';
import TripCard from '../Components/TripCard';
import fetchHelpers from '../utilities/fetchHelpers';
import TripActionCard from '../Components/TripActionCard';
import { Wrap, Flex, Button, Heading, Box, useToast } from '@chakra-ui/react';
import { signOutBeforeTripSelect } from '../utilities/stateHandlers';
import { useAuth0 } from '@auth0/auth0-react';
import Constants from '../utilities/Constants';

function Trips(): JSX.Element {

  // This state will just be local to this component, because it doesn't
  // make sense to store all trips with all metadata, since we will only
  // be viewing one trip at a time
  const initialTripState: Array<TripModel> = [];
  const [trips, setTrips] = useState(initialTripState);
  
  const dispatch = useDispatch();
  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(getTrips, [getAccessTokenSilently]);

  const toast = useToast();

  return (
    <Box background={Constants.BACKROUND_GRADIENT} height={'100vh'} overflowY={'scroll'}>
      <Flex justifyContent={'flex-end'}>
        <Button
          margin="20px"
          size="md"
          colorScheme="red"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
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
    </Box>
  );

  function getTrips() {
    (async function () {
      try {
        const token = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
        const res: Response = await fetch(`/user/trips`, {
          method: 'GET',
          headers: fetchHelpers.getTokenHeader(token),
        });

        if (res.ok) {
          const trips: Array<TripModel> = await res.json();
          setTrips(trips);
        } else {
          const message: any = await res.json();
          throw new Error(JSON.stringify(message));
        }
      } catch (error: any) {
        console.error(error);
        toast({
          position: 'top',
          title: 'Unable to get user trips :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    })();
  }

  function handleSignOut(event: SyntheticEvent) {
    signOutBeforeTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
}

export default Trips;
