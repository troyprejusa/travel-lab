import React from 'react';
import { TripModel, ItineraryModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import NewItineraryModal from '../Components/NewItineraryModal';
import ItineraryCard from '../Components/ItineraryCard';
import { reduxFetchItinerary } from '../redux/ItinerarySlice';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import {
    Flex,
    Stack,
    Box,
    Button,
    Text
} from '@chakra-ui/react';



function Itinerary(): JSX.Element {

    const dispatch = useDispatch();
    const trip: TripModel = useSelector(((state: RootState) => state.trip))
    const itinerary: Array<ItineraryModel> = useSelector((state: RootState) => state.itinerary);

    return (
        <>
            <Flex justifyContent={'center'}>
                <h1>Itinerary</h1>
            </Flex>
            <Flex flexWrap={'wrap'} justifyContent={'space-evenly'}>
                <Stack spacing='4' height={'80vh'} minWidth={'35vw'} overflowY={'scroll'}>
                    <NewItineraryModal getItinerary={getItinerary}/>
                    {itinerary.length === 0 ? 
                    <Text>Nothing planned...</Text> :
                    itinerary.map((itin: ItineraryModel, index: number) => <ItineraryCard key={index} itineraryData={itin} tripData={trip} getItineraryCallback={getItinerary} />)
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
        dispatch(reduxFetchItinerary(trip.id));
    }
}

export default Itinerary;