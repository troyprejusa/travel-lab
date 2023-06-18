import React, { useEffect } from 'react';
import { TripModel, ItineraryModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import { TripStateInterface } from '../redux/TripSlice';
import { ItineraryStateInterface } from '../redux/ItinerarySlice';


interface ItineraryProps {

};

function Itinerary(): JSX.Element {
    function getItinerary() {
        (async function() {
            
        })();
    }

    console.log('ITINERARY:')
    const trip: TripModel = useSelector(((state: RootState) => state.trips.currentTrip))
    
    const dispatch = useDispatch();
    console.log(trip);

    // TODO:
    console.error('THE REASON YOURE LOSING REACT STATE IS BECAUSE OF THE NAVBAR USING LINK, NOT USENAVIGATE')
    // const stops: ItineraryStateInterface = useSelector((state: RootState) => state.itinerary);

    useEffect(getItinerary, []);


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