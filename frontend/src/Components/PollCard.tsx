import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import { pollSocket } from '../utilities/TripSocket';
import { useSelector } from 'react-redux';
import { PollResponseModel, PollVoteModel, PollChartDataPoint, TripModel, UserModel, PollVoteSendModel } from '../utilities/Interfaces'
import {
  Flex,
  Box,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
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
  Heading
} from '@chakra-ui/react'
import { FiEye } from 'react-icons/fi'
import { RootState } from '../redux/Store';
import { AvatarRipple } from './AvatarWrapper';

interface PollCardProps {
  data: PollResponseModel
}

function PollCard(props: PollCardProps) {

  const pollChartData: Array<PollChartDataPoint> = makeDataArray(props.data);

  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const user: UserModel = useSelector((state: RootState) => state.user);

  const { isOpen, onOpen, onClose } = useDisclosure()

  // Create a closure function to bind arguments to the poll information for
  // this poll card
  const constructVote = constructVoteClosure();

  return (
    <>
      <Flex p={'40px'} w="full" alignItems="center" justifyContent="center">
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
          <Flex width={'300px'} height={'300px'} justifyContent={'center'} alignItems={'center'}>
            {
            pollChartData.every((datum: PollChartDataPoint) => datum.count === 0) ?
            <VStack width={'100%'}>
              <Heading as='h4' size='sm'>No votes yet...</Heading>
              <AvatarRipple userData={user} />
            </VStack>
            : 
            <PieChartComponent data={pollChartData} />
            }
          </Flex>
          <Box p="6">
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {props.data.title}
              </Box>
              <Tooltip
                label="View"
                bg="white"
                placement={'top'}
                color={'gray.800'}
                fontSize={'1.2em'}>
                <chakra.a display={'flex'} cursor={'pointer'} onClick={onOpen}>
                  <Icon as={FiEye} h={7} w={7} alignSelf={'center'} />
                </chakra.a>
              </Tooltip>
            </Flex>
            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
              New
            </Badge>
            <h2>{`${props.data.created_by}`}</h2>
            <h3>{`${props.data.created_at}`}</h3>
          </Box>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent width={'80vw'} height={'80vh'} maxW={'80vw'} maxH={'80vh'}>
            <ModalHeader></ModalHeader>
            {/* <ModalCloseButton /> */}

            <ModalBody>
              <VStack>
                <Box width={'40vw'} height={'40vh'}>
                  <BarChartComponent data={pollChartData} constructVoteCallback={constructVote} />
                </Box>
              </VStack>
              <Heading as='h1'>{props.data.title}</Heading>
              <Heading as='h2'>Vote metadata</Heading>
              <Heading as='h2'>Description</Heading>
              <Heading as='h3'>Avatar group</Heading>
            </ModalBody>
  
            <ModalFooter>
              {/* <Button colorScheme='blue' mr={3} onClick={handleClick}>Create</Button> */}
              <Button variant='ghost' onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  )


  function makeDataArray(pollData: PollResponseModel): Array<PollChartDataPoint> {
    return pollData.options.map((optionData: PollVoteModel) => ({
      option: optionData.option, 
      count: optionData.votes.length,
      voted_by: optionData.votes
    }));
  }


  function constructVoteClosure() {
    return (chosenOption: string): PollVoteSendModel | null=> {
      // Look through the various options to find the option_id
      const matchingIndex: number = props.data.options.findIndex((item: PollVoteModel) => item.option === chosenOption);

      if (matchingIndex === -1) return null;

      const optionId: number = props.data.options[matchingIndex].option_id

      const data: PollVoteSendModel = {
        trip_id: trip.id,
        poll_id: props.data.poll_id,
        option_id: optionId,
        voted_by: user.email
      }

      return data;

    }

  }


}

export default PollCard;
