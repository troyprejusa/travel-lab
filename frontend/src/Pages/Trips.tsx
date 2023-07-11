import React, { useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { replaceTrips } from '../redux/TripSlice';
import { TripStateInterface } from '../redux/TripSlice';
import { UserModel, TripModel } from '../Models/Interfaces';
import { Wrap } from '@chakra-ui/react';
import ChakraTripCard from '../Components/ChakraTripCard';
import ChakraAddTripCard from '../Components/ChakraTripCard';
import fetchHelpers from '../utilities/fetchHelpers';

interface TripsProps {

};

function Trips(): JSX.Element {

    const dispatch = useDispatch();
    const user: UserModel = useSelector((state: RootState) => state.user);
    const trips: TripStateInterface = useSelector((state: RootState) => state.trips);

    useEffect(getTrips, []);  

    return (
        <>
            <h1>Trips</h1>
            <h2>Hello {user.first_name}</h2>
            <Wrap>
                {
                    trips.allTrips.map((trip: TripModel, i: number) => {
                        return <ChakraTripCard key = {i} tripIndex={i} tripData={trip} handleDelete={handleDeleteTripClick} />
                    })
                }
                {/* <ChakraAddTripCard handleClick={handleNewTripClick}/> */}
            </Wrap>
        </>
    )

    function getTrips() {
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader()
                });
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
        const json: string = JSON.stringify(trips.allTrips[0]);
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
                    method: 'POST',
                    body: json, 
                    headers: fetchHelpers.getTokenJSONHeader(),
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
        const delIndex: number = parseInt(cardId.split('delete')[1]);
        const json: string = JSON.stringify(trips.allTrips[delIndex]);
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
                    method: 'DELETE',
                    body: json, 
                    headers: fetchHelpers.getTokenJSONHeader(),
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