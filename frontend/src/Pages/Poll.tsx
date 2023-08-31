import React from 'react';
import { Flex } from '@chakra-ui/react';
import NewPollModal from '../Components/NewPollModal';
import { Wrap } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollResponseModel } from '../utilities/Interfaces';
import { reduxFetchPolls } from '../redux/PollSlice';
import { Box, Text } from '@chakra-ui/react';

function Poll(): JSX.Element {
  const dispatch = useDispatch();
  const trip = useSelector((state: RootState) => state.trip);
  const pollState: Array<PollResponseModel> = useSelector(
    (state: RootState) => state.polls
  );

  return (
    <>
      <Flex justifyContent={'center'}>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Poll
        </Text>
      </Flex>
      <NewPollModal getPollsCallback={getPolls} />
      <Wrap margin={'10%'} spacing={'10%'}>
        {pollState.map((poll: PollResponseModel, i: number) => (
          <Box key={i}>
            <PollCard data={poll} getPollsCallback={getPolls} />
          </Box>
        ))}
      </Wrap>
    </>
  );

  function getPolls() {
    dispatch(reduxFetchPolls(trip.id));
  }
}

export default Poll;
