import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { TripModel } from '../Models/Interfaces';
import TripPhoto from '../assets/tripphoto.jpg';
import { tripSocket } from '../utilities/TripSocket';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';



interface ChakraTripCardProps {
  tripData: TripModel,
}

export default function ChakraTripCard(props: ChakraTripCardProps) {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  return (
    <Center py={6} onClick={handleViewClick} cursor={'pointer'}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}>
          <img src={TripPhoto} alt={'trip'} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}>
            {`${props.tripData.start_date}`}
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}>
            {props.tripData.destination}
          </Heading>
          <Text color={'gray.500'}>
            {props.tripData.description}
          </Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>Ya Boi</Text>
            {
            props.tripData.created_at.constructor.name === 'Date' &&
            <Text color={'gray.500'}>{`hi`}</Text>
            }
          </Stack>
        </Stack>
      </Box>
    </Center>
  );

  function handleViewClick(event: SyntheticEvent) {

    const authToken: string | null = localStorage.getItem("token");

    if (authToken) {
      // Establish a websocket connection for these rooms
      // globalSocket.establishSocket(authToken, props.tripData.id);
      // msgSocket.establishSocket(authToken, props.tripData.id);
      tripSocket.establishSocket(authToken, props.tripData.id);
  
      // Set this trip as the current trip in state
      dispatch(reduxSetTrip(props.tripData));
  
      // Navigate on to view the trip
      navigate(`/trip/${props.tripData.id}/home`);

    } else {
      alert('Unable to view trip!')
    }

  }
}