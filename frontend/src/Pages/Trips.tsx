import React, { useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { replaceTrips } from '../redux/TripSlice';
import { TripStateInterface } from '../redux/TripSlice';
import { UserModel, TripModel } from '../Models/Interfaces';
import { Wrap } from '@chakra-ui/react';
import ChakraTripCard from '../Components/ChakraTripCard';
import ChakraNewTrip from '../Components/ChakraNewTrip';
import fetchHelpers from '../utilities/fetchHelpers';
import {
    useDisclosure,
    Button
  } from '@chakra-ui/react'

interface TripsProps {

};

function Trips(): JSX.Element {

    const dispatch = useDispatch();
    // const user: UserModel = useSelector((state: RootState) => state.user);
    const trips: TripStateInterface = useSelector((state: RootState) => state.trips);

    useEffect(getTrips, []);

    return (
        <>
            <Wrap margin={'10%'} spacing={'10%'}>
                {trips.allTrips.map((trip: TripModel, i: number) => <ChakraTripCard key = {i} tripData={trip}/>)}
                <ChakraNewTrip />
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
                    const trips: Array<TripModel> = await res.json();
                    dispatch(replaceTrips(trips));
                    
                } else {
                    const message: any = await res.json();
                    throw new Error(JSON.stringify(message));
                }
                
            } catch (e: any) {
                console.error(e.message);
            }
        })();
    }

    function handleNewTripClick(event: SyntheticEvent) {

    }

    // function sendNewTrip() {
    //     const json: string = JSON.stringify(trips.allTrips[0]);
    //     (async function() {
    //         try {
    //             const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
    //                 method: 'POST',
    //                 body: json, 
    //                 headers: fetchHelpers.getTokenJSONHeader(),
    //             });
    //             if (res.ok) {
    //                 // Instead of adding the trip individually from local state,
    //                 // we will reload all trips to avoid any synchronization issues
    //                 // between the frontend and backend
    //                 getTrips();
    //             }
    //         } catch (e) {
    //             console.error('Unable to add trip');
    //         }
    //     })();
    // }
}

export default Trips;