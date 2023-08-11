import React, { SyntheticEvent } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';
import NewPollModal from '../Components/NewPollModal';
import { Wrap } from '@chakra-ui/react';
import { PollState } from '../redux/PollSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollModel } from '../utilities/Interfaces';



function Poll(): JSX.Element {

    const pollState: PollState = useSelector((state: RootState) => state.polls);

    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <Wrap margin={'10%'} spacing={'10%'}>
                {pollState.polls.map((trip: PollModel, i: number) => <PollCard key = {i} tripData={trip}/>)}
                <NewPollModal />
            </Wrap>
        </>

    )
}

export default Poll;