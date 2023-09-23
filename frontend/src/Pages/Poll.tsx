import React from 'react';
import { Flex } from '@chakra-ui/react';
import NewPollModal from '../Components/NewPollModal';
import { Wrap } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollResponseModel } from '../utilities/Interfaces';
import { reduxFetchPolls } from '../redux/PollSlice';
import fetchHelpers from '../utilities/fetchHelpers';
import { Box, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import TitleBar from '../Components/TitleBar';


function Poll(): JSX.Element {
  const dispatch = useDispatch();
  const trip = useSelector((state: RootState) => state.trip);
  const pollState: Array<PollResponseModel> = useSelector(
    (state: RootState) => state.polls
  );
  const { getAccessTokenSilently } = useAuth0();

  return (
    <>
      <TitleBar text='Poll' />
      <NewPollModal getPollsCallback={getPolls} />
      <Flex
        margin={'10%'}
        alignItems="center"
        justifyContent="space-evenly"
        gap={'60px'}
        wrap={'wrap'}
      >
        {pollState.map((poll: PollResponseModel, i: number) => (
          <Box key={i}>
            <PollCard data={poll} getPollsCallback={getPolls} />
          </Box>
        ))}
      </Flex>
    </>
  );

  async function getPolls() {
    const token: string = await fetchHelpers.getAuth0Token(
      getAccessTokenSilently
    );
    dispatch(reduxFetchPolls({ trip_id: trip.id, token: token }));
  }
}

export default Poll;
