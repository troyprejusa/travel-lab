import React, { useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { replaceTrips } from '../redux/TripSlice';
import { UserModel, TripModel } from '../Models/Interfaces';
import fakeLogin from '../etc/FakeLogin';
import { Flex } from '@chakra-ui/react';
import ChakraTripCard from '../Components/ChakraTripCard';
import ChakraAddTripCard from '../Components/ChakraTripCard';

interface TripsProps {

};

function Trips(): JSX.Element {

    const dispatch = useDispatch();
    const user: UserModel = useSelector((state: RootState) => state.user);
    const trips: Array<TripModel> = useSelector((state: RootState) => state.trips);

    // DEV ONLY    
    useEffect(()=> fakeLogin(dispatch), []);   // Login on first render

    // Get the trips when the user changes
    // TODO: Remove the user dependency when the fake login is removed
    useEffect(getTrips, [ user ]);  

    return (
        <>
            <h1>Trips</h1>
            <h2>Hello {user.first_name}</h2>
            <Flex>
                {
                    trips.map((trip: TripModel, i: number) => {
                        return <ChakraTripCard key = {i} tripData={trip} />
                    })
                }
                <ChakraAddTripCard clickHandler={handleNewTripClick}/>
            </Flex>
        </>
    )


    function getTrips() {
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?userid=${user.id}`);
                if (res.ok) {
                    const obj: TripModel = await res.json();
                    dispatch(replaceTrips(obj));
                } else {
                    const obj = await res.json();
                    throw new Error(JSON.stringify(obj));
                }
            } catch (e: any) {
                console.error(e.message);
            }
        })();
    }

    function handleNewTripClick(event: SyntheticEvent) {
        const json: string = JSON.stringify(trips[0]);
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
                    method: 'POST',
                    body: json, 
                    headers: new Headers({'content-type': 'application/json'}),
                });
                if (res.ok) {
                    // Instead of adding the trip individually from local state,
                    // we will reload all trips to avoid any synchronization issues
                    // between the frontend and backend
                    getTrips();
                }
            } catch (e) {
                console.error('Unable to add trip');
            }
        })();
    }

    function handleDeleteTripClick(event: SyntheticEvent) {
        const target = event.target as HTMLElement;
        const cardId: string = target.id; 
        const delIndex: number = parseInt(cardId.split('card')[1]);
        const json: string = JSON.stringify(trips[delIndex]);
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
                    method: 'DELETE',
                    body: json, 
                    headers: new Headers({'content-type': 'application/json'}),
                });
                if (res.ok) {
                    // Instead of deleting the trip individually from local state,
                    // we will reload all trips to avoid any synchronization issues
                    // between the frontend and backend
                    getTrips();

                } else {
                    const obj = await res.json();
                    throw new Error(obj);
                }
            } catch (e: any) {
                console.error(e.message);
            }
        })();
    }
}

export default Trips;