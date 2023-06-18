import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel, TripModel } from '../Models/Interfaces';

interface HomeProps {

};

function Home(): JSX.Element {
    console.log('HOME:')
    const trip: TripModel = useSelector(((state: RootState) => state.trips.currentTrip))

    return (
        <h1>Home</h1>
    )
}

export default Home;