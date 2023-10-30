import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reduxSetTrip } from '../redux/TripSlice';
import { TripModel } from '../utilities/Interfaces';
import Constants from '../utilities/Constants';
import {
  itinerarySocket,
  msgSocket,
  packingSocket,
  pollSocket,
} from '../utilities/TripSocket';
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
  useToast,
} from '@chakra-ui/react';

interface TripCardProps {
  tripData: TripModel;
}

function TripCard(props: TripCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  return (
    <Center py={6} onClick={() => handleViewClick()} cursor={'pointer'}>
      <Box
        w={'sm'}
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
            src={Constants.PHOTO_MAP[props.tripData.vacation_type]}
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
            <Text fontWeight={600}>{props.tripData.created_by}</Text>
            {props.tripData.created_at.constructor.name === 'Date' && (
              <Text color={'gray.500'}>{`hi`}</Text>
            )}
          </Stack>
        </Stack>
      </Box>
    </Center>
  );

  async function handleViewClick() {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );

      // Establish a websocket connection for these rooms
      itinerarySocket.establishSocket(token, props.tripData.id, dispatch);
      pollSocket.establishSocket(token, props.tripData.id, dispatch);
      packingSocket.establishSocket(token, props.tripData.id, dispatch);
      msgSocket.establishSocket(token, props.tripData.id, dispatch);

      // Set this trip as the current trip in state
      dispatch(reduxSetTrip(props.tripData));

      // Navigate on to view the trip
      navigate(`/trip/${props.tripData.id}/home`);
    } catch (error: any) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to view trip :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default TripCard;
