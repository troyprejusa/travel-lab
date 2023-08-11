import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { TripModel, UserModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import ContactCard from '../Components/ContactCard';
import { Wrap, Flex } from '@chakra-ui/react';

// interface ContactInfoProps {

// };

function ContactInfo(): JSX.Element {

    // const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);

    const initialState: Array<UserModel> = [];
    const [travelCompanions, setTravelCompanions] = useState(initialState);

    useEffect(getTravellers, []);

    return (
        <>
            <Flex justifyContent={'center'}>
                <h1>Contact Info</h1>
            </Flex>
            <Wrap spacing={'5%'}>
                {travelCompanions.map((a: UserModel, i: number) => <ContactCard key={i} {...a}/>)}
            </Wrap>
        </>
    )

    function getTravellers() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/${trip.id}/contacts`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader(),
                });

                if (res.ok) {
                    const travellers: Array<UserModel> = await res.json();
                    // console.log(travellers)
                    setTravelCompanions(travellers);

                } else {
                    const message: any = await res.json();
                    throw new Error(JSON.stringify(message));
                }

            } catch(e) {
                console.error('Unable to get travel companions!')
                throw e
            }
        })()
    }
}

export default ContactInfo;