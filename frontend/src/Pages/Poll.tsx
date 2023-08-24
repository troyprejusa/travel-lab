import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';
import NewPollModal from '../Components/NewPollModal';
import { Wrap } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollResponseModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import { reduxSetPolls } from '../redux/PollSlice';
import { Box } from '@chakra-ui/react';



function Poll(): JSX.Element {

    useEffect(getPolls, []);

    // Redux
    const dispatch = useDispatch();
    const trip = useSelector((state: RootState) => state.trip)
    const pollState: Array<PollResponseModel> = useSelector((state: RootState) => state.polls);

    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <NewPollModal getPollsCallback={getPolls} />
            <Wrap margin={'10%'} spacing={'10%'}>
                {pollState.map((poll: PollResponseModel, i: number) => <Box key={i}><PollCard data={poll} getPollsCallback={getPolls} /></Box>)}
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
                    const pollData: Array<PollResponseModel> = await res.json();

                    // console.log(pollData)
                    dispatch(reduxSetPolls(pollData));
                    
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