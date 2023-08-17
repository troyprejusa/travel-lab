import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';
import NewPollModal from '../Components/NewPollModal';
import { Wrap } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollBackendResponse, PollModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import { reduxSetPolls, PollState } from '../redux/PollSlice';



function Poll(): JSX.Element {

    // useEffect(getPolls, []);
    const trip = useSelector((state: RootState) => state.trip)
    const pollState: PollState = useSelector((state: RootState) => state.polls);

    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <Wrap margin={'10%'} spacing={'10%'}>
                {pollState.polls.map((poll: PollModel, i: number) => <PollCard key = {i} pollData={poll}/>)}
                <NewPollModal getPollsCallback={getPolls} />
                <button onClick={getPolls}>Click me!</button>
            </Wrap>
        </>

    )

    function getPolls() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/${trip.id}/poll`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader()
                });

                
                if (res.ok) {
                    const polls = await res.json();
                    console.log(polls)
                    // reduxSetPolls(polls);
                    
                } else {
                    const message = await res.json();
                    throw new Error(JSON.stringify(message));
                }
            } catch (e: any) {
                console.error(e.message);
            }
        })();
    }

}

export default Poll;