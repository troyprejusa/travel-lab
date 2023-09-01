import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TripModel } from '../utilities/Interfaces';
import TripCard from '../Components/TripCard';
import fetchHelpers from '../utilities/fetchHelpers';
import TripActionCard from '../Components/TripActionCard';
import { Wrap, Flex, Button, Heading } from '@chakra-ui/react';
import { signOutBeforeTripSelect } from '../utilities/stateResets';

function Trips(): JSX.Element {
  const navigate = useNavigate();
  const initialTripState: Array<TripModel> = [];
  const [trips, setTrips] = useState(initialTripState);
  const dispatch = useDispatch();
  // const user: UserModel = useSelector((state: RootState) => state.user);
  // const trip: TripModel = useSelector((state: RootState) => state.trip);

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
        const res: Response = await fetch(`/user/trips`, {
          method: 'GET',
          headers: fetchHelpers.getTokenHeader(),
        });

        if (res.ok) {
          const trips: Array<TripModel> = await res.json();
          setTrips(trips);
        } else {
          const message: any = await res.json();
          throw new Error(JSON.stringify(message));
        }
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }

  function handleSignOut(event: SyntheticEvent) {
    signOutBeforeTripSelect(dispatch);
    navigate('/');
  }

}

export default Trips;
