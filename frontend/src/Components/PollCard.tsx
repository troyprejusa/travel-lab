import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { AvatarRipple } from './AvatarWrapper';
import { TrashButton } from './Buttons';
import {
  PollResponseModel,
  PollVoteModel,
  PollChartDataPoint,
  TripModel,
  UserModel,
  PollVoteWS,
} from '../utilities/Interfaces';
import {
  Flex,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Badge,
  Heading,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import Constants from '../utilities/Constants';
import { pollSocket } from '../utilities/TripSocket';

interface PollCardProps {
  data: PollResponseModel;
}

function PollCard(props: PollCardProps) {
  const pollChartData: Array<PollChartDataPoint> = makeDataArray(props.data);

  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const user: UserModel = useSelector((state: RootState) => state.user);
  const confirmed_travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  ).filter((traveller: UserModel) => traveller.confirmed);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Did this user vote on this poll?
  let userVoted: boolean = false;
  props.data.options.forEach((optionItem: PollVoteModel) => {
    optionItem.votes.forEach((voter: string) => {
      if (voter === user.email) {
        userVoted = true;
      }
    });
  });

  // Vote tally
  const remainingVotes =
    confirmed_travellers.length -
    props.data.options.reduce((prev, curr) => prev + curr.votes.length, 0);

  return (
    <>
      <Box
        onClick={onOpen}
        cursor={'pointer'}
        background={Constants.BACKGROUND_TRANSPARENCY}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        <Flex
          width={'300px'}
          height={'300px'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {pollChartData.every(
            (datum: PollChartDataPoint) => datum.count === 0
          ) ? (
            <VStack width={'100%'}>
              <Heading as="h4" size="sm">
                No votes yet...
              </Heading>
              <AvatarRipple
                userData={
                  confirmed_travellers[
                    confirmed_travellers.findIndex(
                      (traveller: UserModel) =>
                        props.data.created_by === traveller.email
                    )
                  ]
                }
              />
            </VStack>
          ) : (
            <PieChartComponent data={pollChartData} />
          )}
        </Flex>
        <Box p="6">
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {props.data.title}
            </Box>
          </Flex>
          {userVoted ? (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="green">
              voted
            </Badge>
          ) : (
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              vote
            </Badge>
          )}
          <Text>{props.data.created_by}</Text>
          <Text>{new Date(props.data.created_at).toDateString()}</Text>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          // width={'60vw'}
          // height={'80vh'}
          maxW={'60vw'}
          maxH={'80vh'}
        >
          <ModalHeader></ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            <VStack>
              <Box width={'40vw'} height={'40vh'}>
                <BarChartComponent
                  userVoted={userVoted}
                  dataPoints={pollChartData}
                  constructVoteCallback={constructVote}
                />
              </Box>
            </VStack>
            <Box padding={'1rem'}>
              <Box textAlign={'center'}>
                {remainingVotes === 0 ? (
                  <Text
                    textTransform={'uppercase'}
                    color={'green.400'}
                    fontWeight={600}
                    fontSize={'sm'}
                    bg={'green.50'}
                    p={2}
                    alignSelf={'flex-start'}
                    rounded={'md'}
                  >
                    vote complete
                  </Text>
                ) : (
                  <Text
                    textTransform={'uppercase'}
                    color={'red.400'}
                    fontWeight={600}
                    fontSize={'sm'}
                    bg={'red.50'}
                    p={2}
                    alignSelf={'flex-start'}
                    rounded={'md'}
                  >
                    {`${remainingVotes} vote${
                      remainingVotes > 1 ? 's' : ''
                    } remaining`}
                  </Text>
                )}
              </Box>
              <Flex justifyContent={'space-between'} marginTop='1rem' marginBottom={'1rem'}>
                <Box>
                  <Heading size={'lg'}>{props.data.title}</Heading>
                  <Text size={'sm'} color={'gray.500'}>
                    Created by: {props.data.created_by}
                  </Text>
                </Box>
                <ButtonGroup>
                  <TrashButton
                    onClick={() => handleDeleteButtonClick(props.data.poll_id)}
                    aria-label="delete poll"
                    tooltipMsg={
                      user.admin
                        ? 'Delete poll'
                        : 'Only trip admins can delete polls'
                    }
                    disabled={!user.admin}
                  />
                </ButtonGroup>
              </Flex>
              <Box>
                <Heading size={'md'}>Description:</Heading>
                <Text>{props.data.description || 'Nothing to show...'}</Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  function makeDataArray(
    pollData: PollResponseModel
  ): Array<PollChartDataPoint> {
    return pollData.options.map((optionData: PollVoteModel) => ({
      option: optionData.option,
      count: optionData.votes.length,
      voted_by: optionData.votes,
    }));
  }

  function constructVote(chosenOption: string): PollVoteWS | null {
    // Look through the various options to find the option_id
    const matchingIndex: number = props.data.options.findIndex(
      (item: PollVoteModel) => item.option === chosenOption
    );

    if (matchingIndex === -1) return null;

    const optionId: number = props.data.options[matchingIndex].option_id;

    const data: PollVoteWS = {
      trip_id: trip.id,
      poll_id: props.data.poll_id,
      option_id: optionId,
      voted_by: user.email,
    };

    return data;
  }

  async function handleDeleteButtonClick(poll_id: number) {
    pollSocket.deletePoll({ trip_id: trip.id, poll_id: poll_id });

    // Close the modal
    onClose();
  }
}

export default PollCard;
