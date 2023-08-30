import React, { useEffect, useState } from 'react';
import { TripModel } from '../utilities/Interfaces';
import TripCard from '../Components/TripCard';
import fetchHelpers from '../utilities/fetchHelpers';
import TripActionCard from '../Components/TripActionCard';
import { 
    Wrap
} from '@chakra-ui/react';


function Trips(): JSX.Element {

    const initialTripState: Array<TripModel> = [];
    const [ trips, setTrips ] = useState(initialTripState);
    // const dispatch = useDispatch();
    // const user: UserModel = useSelector((state: RootState) => state.user);
    // const trip: TripModel = useSelector((state: RootState) => state.trip);

    useEffect(getTrips, []);

    return (
        <>
            <Wrap margin={'10%'} spacing={'10%'}>
                {trips.map((trip: TripModel, i: number) => <TripCard key = {i} tripData={trip}/>)}
                <TripActionCard />
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
}

export default Trips;