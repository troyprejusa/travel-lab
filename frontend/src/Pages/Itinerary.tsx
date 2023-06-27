import React, { useEffect } from 'react';
import { TripModel, ItineraryModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import { TripStateInterface } from '../redux/TripSlice';
import { ItineraryStateInterface, replaceItinerary } from '../redux/ItinerarySlice';


interface ItineraryProps {

};

function Itinerary(): JSX.Element {
    function getItinerary() {
        (async function() {
            // TODO: After you get the itinerary stops from the backend,
            // update the state
            // dispatch(replaceItinerary(stuff))
        })();
    }

    console.log('ITINERARY:')
    const trip: TripModel = useSelector(((state: RootState) => state.trips.currentTrip))
    
    const dispatch = useDispatch();
    const stops: ItineraryStateInterface = useSelector((state: RootState) => state.itinerary);

    // useEffect(getItinerary, []);


    return (
        <>
            <h1>Itinerary</h1>
                <button>Add stop</button>
                <h2>PUT A CALENDAR HERE!</h2>
                <h2>Events</h2>
        </>

    )
}

export default Itinerary;