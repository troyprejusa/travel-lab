import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { TripModel, UserModel } from '../Models/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';

interface ContactInfoProps {

};

function ContactInfo(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trips.currentTrip);

    const initialState: Array<UserModel> = [];
    const [travelCompanions, setTravelCompanions] = useState(initialState);

    useEffect(getTravellers, []);

    return (
        <>
            <h1>ContactInfo</h1>
            {travelCompanions.map((a: UserModel) => {
                return <h2>{a.first_name}</h2>
            })}
        </>
    )

    function getTravellers() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/contacts/${trip.id}`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader(),
                });

                if (res.ok) {
                    const json = await res.json();
                    const travellers: Array<UserModel> = json.travellers;
                    console.log(travellers)
                    setTravelCompanions(travellers);

                } else {
                    throw new Error();
                }

            } catch(e) {
                console.error('Unable to get travel companions!')
                throw e
            }
        })()
    }
}

export default ContactInfo;