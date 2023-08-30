import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { TripModel, UserModel } from '../utilities/Interfaces';
import TripPhoto from '../assets/tripphoto.jpg';
import { msgSocket, pollSocket } from '../utilities/TripSocket';
import { AvatarWrapper } from './AvatarWrapper';
import NewTripModal from '../Components/NewTripModal';
import JoinTripModal from '../Components/JoinTripModal';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { RootState } from '../redux/Store';



interface TripActionCardProps {

}

function TripActionCard(props: TripActionCardProps) {

  return (
    <Center py={6}>
      <Box
        maxW={'300px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
          <VStack spacing={'40px'}>
            <Heading size={'md'}>Join an existing trip</Heading>
            <JoinTripModal />
            <Divider />
            <Heading size={'md'}>Create your own trip</Heading>
            <NewTripModal />
          </VStack>
      </Box>
    </Center>
  );
}

export default TripActionCard;
