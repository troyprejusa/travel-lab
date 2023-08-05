import React, { SyntheticEvent, useEffect, useState } from 'react';
import { TripModel, ItineraryModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import ChakraNewItinerary from '../Components/ChakraNewItinerary';
import ItineraryEntry from '../Components/ChakraItineraryEntry';
import fetchHelpers from '../utilities/fetchHelpers';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
    Flex,
    Stack,
    Box,
    Button,
    Text
} from '@chakra-ui/react';



function Itinerary(): JSX.Element {

    // Local state
    const itineraryInitial: Array<ItineraryModel> = [];
    const [itinerary, setItinerary] = useState(itineraryInitial);

    // Redux
    const trip: TripModel = useSelector(((state: RootState) => state.trip))
    
    useEffect(getItinerary, []);

    return (
        <>
            <Flex justifyContent={'center'}>
                <h1>Itinerary</h1>
            </Flex>
            <Flex flexWrap={'wrap'} justifyContent={'space-evenly'}>
                <Stack spacing='4' height={'80vh'} minWidth={'35vw'} overflowY={'scroll'}>
                    <ChakraNewItinerary getItinerary={getItinerary}/>
                    {itinerary.length === 0 ? 
                    <Text>Nothing planned...</Text> :
                    itinerary.map((itin, index) => <ItineraryEntry key={index} {...itin} />)
                    }
                </Stack>
                <Box minWidth={'35vw'}>
                    <FullCalendar 
                    plugins={[ dayGridPlugin ]} 
                    initialView="dayGridMonth" 
                    events={itinerary.map((a) => {
                        return {'title': 'hi', 'date': '2019-04-04'}
                    })}
                    />
                </Box>
            </Flex>
        </>
    )

    function getItinerary() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/${trip.id}/itinerary`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader()
                })

                if (res.ok) {
                    const itineraryArray: Array<ItineraryModel> = await res.json();
                    setItinerary(itineraryArray);

                } else {
                    const json = await res.json();
                    throw new Error(json.message)
                }
            } catch (e) {
                console.error(e);
                alert('Unable to get itinerary information!')
            }
        })();
    }
}

export default Itinerary;