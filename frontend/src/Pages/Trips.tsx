import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { login } from '../redux/UserSlice';
import { replaceTrips, addTrip, removeTrip } from '../redux/TripSlice';
import { UserModel, TripModel } from '../Models/Interfaces';

interface TripsProps {

};

function Trips(): JSX.Element {

    const dispatch = useDispatch();
    const user: UserModel = useSelector((state: RootState) => state.user);
    const trips: Array<TripModel> = useSelector((state: RootState) => state.trips);

    // DEV ONLY    
    useEffect(fakeLogin, []);   // Login on first render

    // Get the trips when the user changes
    useEffect(getTrips, [ user ]);  

    return (
        <>
            <h1>Trips</h1>
            <h2>{user.first_name}</h2>
            <ul>
                {
                    trips.map((trip: TripModel, i: number) => {
                        return <li key={i}>{trip.destination}</li>
                    })
                }
            </ul>
        </>
    )

    // DEV ONLY
    function fakeLogin() {
        (async function() {
            /* Query database directly to get the data for troy prejusa */
            try {
                const res: Response = await fetch('/dev?email=troy@test.com');
                const json: UserModel = await res.json();
                dispatch(login(json));

            } catch (e) {
                console.error('No developing today :(')
            }
        })();
    }

    function getTrips() {
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?id=${user.id}`);
                const json: TripModel = await res.json();
                dispatch(replaceTrips(json));
            } catch (e) {
                console.error('Unable to retrieve trips')
            }
        })();
    }
}

export default Trips;