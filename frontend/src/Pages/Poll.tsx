import React from 'react';
import { Flex } from '@chakra-ui/react';
import NewPollModal from '../Components/NewPollModal';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import PollCard from '../Components/PollCard';
import { PollResponseModel } from '../utilities/Interfaces';
import { Box } from '@chakra-ui/react';
import TitleBar from '../Components/TitleBar';
import PulseDot from '../Components/PulseDot';

function Poll(): JSX.Element {
  const polls: Array<PollResponseModel> = useSelector(
    (state: RootState) => state.polls
  );

  return (
    <>
      <TitleBar text="Poll">
        <PulseDot />
      </TitleBar>
      <NewPollModal />
      <Flex
        margin={'10%'}
        alignItems="center"
        justifyContent="space-evenly"
        gap={'60px'}
        wrap={'wrap'}
      >
        {polls.map((poll: PollResponseModel, i: number) => (
          <Box key={i}>
            <PollCard data={poll} />
          </Box>
        ))}
      </Flex>
    </>
  );
}

export default Poll;
