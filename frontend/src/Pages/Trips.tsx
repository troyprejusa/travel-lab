import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { login } from '../redux/UserSlice';
import { UserModel, TripModel } from '../Models/Interfaces';
import { log } from 'console';

interface TripsProps {

};

function Trips(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    // DEV ONLY    
    useEffect(fakeLogin, []);
    useEffect(getTrips, [user]);



    return (
        <>
            <h1>Trips</h1>
            <h2>{user.first_name}</h2>
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
                console.log(json);
            } catch (e) {
                console.error('Unable to retrieve trips')
            }
        })();
    }
}

export default Trips;