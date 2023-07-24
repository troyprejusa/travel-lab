import React, { useEffect } from 'react';
import { TripModel, ItineraryModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import {
    Flex,
    Stack,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text
} from '@chakra-ui/react';


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
    const trip: TripModel = useSelector(((state: RootState) => state.trip))
    
    // useEffect(getItinerary, []);


    return (
        <>
            <Flex justifyContent={'center'}>
                <h1>Itinerary</h1>
            </Flex>
            <Stack spacing='4'>
                {['outline'].map((variant) => (
                    <Card key={variant} variant={variant}>
                    <CardHeader>
                        <Heading size='md'> {variant}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>variant = {variant}</Text>
                    </CardBody>
                    </Card>
                ))}
            </Stack>
        </>

    )
}

export default Itinerary;