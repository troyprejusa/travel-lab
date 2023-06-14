import React, { useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/Store';
import { replaceTrips, addTrip, removeTrip } from '../redux/TripSlice';
import { UserModel, TripModel } from '../Models/Interfaces';
import fakeLogin from '../etc/FakeLogin';

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
            <div>
                {
                    trips.map((trip: TripModel, i: number) => {
                        return (
                            <div key={i} id={`card${i}`} onClick={handleDeleteTripClickBubble}>
                                <p>{trip.destination}</p>
                                <button>Delete trip</button>
                            </div>
                        )
                    })
                }
                <button>Add new trip</button>
            </div>
        </>
    )


    function getTrips() {
        (async function() {
            try {
                const res: Response = await fetch(`/user/trips?id=${user.id}`);
                if (res.ok) {
                    const json: TripModel = await res.json();
                    dispatch(replaceTrips(json));
                } else {
                    throw new Error();
                }
            } catch (e) {
                console.error(`Unable to retrieve trips for ${user.first_name} ${user.last_name}!`);
            }
        })();
    }

    // function handleSubmitTripClick() {
    //     (async function() {
    //         try {
    //             const res: Response = await fetch();
    //             if (res.ok) {
    //                 // Add this to the local state
    //                 dispatch(addTrip(trip));
    //             }
    //         } catch (e) {
    //             console.error('Unable to add trip');
    //         }
    //     })();
    // }

    function handleDeleteTripClickBubble(e: SyntheticEvent) {
        // When clicking on the delete button on the card, we are going to let it 
        // bubble up to the top level of the card element and execute it there,
        // which is why we're suing e.currentTarget and not e.target
        const cardId: string = e.currentTarget.id;
        const delIndex: number = parseInt(cardId.split('card')[1]);
        (async function() {
            try {
                const res: Response = await fetch(); // TODO: Populate this fetch
                if (res.ok) {
                    // Remove this from local state
                    dispatch(removeTrip(trips[delIndex]));
                } else {
                    throw new Error();
                }
            } catch (e) {
                console.error('Unable to delete trip');
            }
        })();
    }
}

export default Trips;