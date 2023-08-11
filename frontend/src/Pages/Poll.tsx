import React, { SyntheticEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';
import NewPollModal from '../Components/NewPollModal';



function Poll(): JSX.Element {

    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <Wrap margin={'10%'} spacing={'10%'}>
                {trips.map((trip: TripModel, i: number) => <TripCard key = {i} tripData={trip}/>)}
                <NewPollModal />
            </Wrap>
        </>

    )
}

export default Poll;