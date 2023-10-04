import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import { useSelector } from 'react-redux';
import fetchHelpers from '../utilities/fetchHelpers';
import { RootState } from '../redux/Store';
import { AvatarRipple } from './AvatarWrapper';
import { useAuth0 } from '@auth0/auth0-react';
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
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getAccessTokenSilently } = useAuth0();

  // Did this user vote on this poll?
  let userVoted: boolean = false;
  props.data.options.forEach((optionItem: PollVoteModel) => {
    optionItem.votes.forEach((voter: string) => {
      if (voter === user.email) {
        userVoted = true;
      }
    });
  });

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
                  travellers[
                    travellers.findIndex(
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
          <h2>{props.data.created_by}</h2>
          <h3>{`${new Date(props.data.created_at).toDateString()}`}</h3>
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
            <Flex justifyContent={'flex-end'}>
              <ButtonGroup>
                <TrashButton
                  onClick={() => handleDeleteButtonClick(props.data.poll_id)}
                  aria-label="delete poll"
                  tooltipMsg={
                    user.admin ? '' : 'Only trip admins can delete polls'
                  }
                  disabled={!user.admin}
                />
              </ButtonGroup>
            </Flex>
            <Heading size={'lg'}>{props.data.title}</Heading>
            <Heading size={'sm'}>{props.data.created_by}</Heading>
            <Box>
              <Heading size={'md'}>Description:</Heading>
              <Text>{props.data.description}</Text>
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
    pollSocket.deletePoll({"trip_id": trip.id, "poll_id": poll_id});

    // Close the modal
    onClose();
  }
}

export default PollCard;
