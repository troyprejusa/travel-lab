import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { TripModel, UserModel } from '../utilities/Interfaces';
import TripPhoto from '../assets/tripphoto.jpg';
import { msgSocket, pollSocket } from '../utilities/TripSocket';
import { AvatarWrapper } from './AvatarWrapper';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { RootState } from '../redux/Store';

interface TripCardProps {
  tripData: TripModel;
}

function TripCard(props: TripCardProps) {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  return (
    <Center py={6} onClick={handleViewClick} cursor={'pointer'}>
      <Box
        w={'md'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
        >
          <img
            src={TripPhoto}
            alt={'trip'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            {props.tripData.start_date} | {props.tripData.start_date}
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {props.tripData.destination}
          </Heading>
          <Text color={'gray.500'}>{props.tripData.description}</Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          {/* <AvatarWrapper userData={user} /> */}
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text
              fontWeight={600}
            >{props.tripData.created_by}</Text>
            {props.tripData.created_at.constructor.name === 'Date' && (
              <Text color={'gray.500'}>{`hi`}</Text>
            )}
          </Stack>
        </Stack>
      </Box>
    </Center>
  );

  async function handleViewClick(event: SyntheticEvent) {
    try {
      const token: string = await fetchHelpers.getAuth0Token(getAccessTokenSilently);

      if (token) {
        // Establish a websocket connection for these rooms
        msgSocket.establishSocket(token, props.tripData.id, dispatch);
        pollSocket.establishSocket(token, props.tripData.id, dispatch);

        // Set this trip as the current trip in state
        dispatch(reduxSetTrip(props.tripData));

        // Navigate on to view the trip
        navigate(`/trip/${props.tripData.id}/home`);
      } else {
        alert('Unable to view trip!');
      }
    } catch (error: any) {
      console.error(error);
      alert('Unable to view trip');
    }
  }
}

export default TripCard;
