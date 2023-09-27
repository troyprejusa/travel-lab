import React from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
import { ItineraryModel, TripModel, UserModel } from '../utilities/Interfaces';
import { EditButton, TrashButton } from './Buttons';
import Constants from '../utilities/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  CardFooter,
  ButtonGroup,
  Box,
  Flex,
} from '@chakra-ui/react';

interface ItineraryCardProps {
  itineraryData: ItineraryModel;
  getItineraryCallback: () => void;
}

function ItineraryCard(props: ItineraryCardProps) {
  const { getAccessTokenSilently } = useAuth0();

  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const user: UserModel = useSelector((state: RootState) => state.user);

  const startDateTime: Date = new Date(props.itineraryData.start_time);
  const endDateTime: Date = new Date(props.itineraryData.end_time);

  return (
    <Card variant={'outline'} background={Constants.BACKGROUND_TRANSPARENCY}>
      <CardHeader>
        <Heading size="md">{props.itineraryData.title}</Heading>
        <Box marginTop={'10px'}>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            {startDateTime.toDateString()} {startDateTime.toLocaleTimeString()}
          </Text>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            {endDateTime.toDateString()} {endDateTime.toLocaleTimeString()}
          </Text>
        </Box>
      </CardHeader>
      <CardBody>
        <Box>
          <Heading size={'sm'}>Description:</Heading>
          <Text>{props.itineraryData.description}</Text>
        </Box>
      </CardBody>
      <CardFooter>
        <Flex width="100%" justifyContent={'space-between'}>
          <Box>
            <Heading size="xs">Created by:</Heading>
            <Text>{props.itineraryData.created_by}</Text>
          </Box>
          <ButtonGroup>
            <EditButton
              aria-label="edit itinerary details"
              tooltipMsg="Feature in work"
              disabled={true}
            />
            <TrashButton
              aria-label="delete itinerary stop"
              clickHandler={() => handleItineraryDelete(props.itineraryData.id)}
              disabled={!user.admin}
              tooltipMsg={
                user.admin ? '' : 'Only trip admins can delete itinerary stops'
              }
            />
          </ButtonGroup>
        </Flex>
      </CardFooter>
    </Card>
  );

  async function handleItineraryDelete(itinerary_id: number) {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(
        `/trip/${trip.id}/itinerary/${itinerary_id}`,
        {
          method: 'DELETE',
          headers: fetchHelpers.getTokenHeader(token),
        }
      );

      if (res.ok) {
        // Refresh table data
        props.getItineraryCallback();
      } else {
        const errorRes: any = await res.json();
        throw new Error(errorRes);
      }
    } catch (e: any) {
      console.error(e);
      alert('Unable to itinerary stop :(');
    }
  }
}

export default ItineraryCard;
