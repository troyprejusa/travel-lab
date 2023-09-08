import React from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { useAuth0 } from '@auth0/auth0-react';
import { ItineraryModel, TripModel } from '../utilities/Interfaces';
import { EditButton, TrashButton } from './Buttons';
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  CardFooter,
  ButtonGroup,
  Box
} from '@chakra-ui/react';

interface ItineraryCardProps {
  itineraryData: ItineraryModel;
  tripData: TripModel;
  getItineraryCallback: () => void;
}

function ItineraryCard(props: ItineraryCardProps) {

  const { getAccessTokenSilently } = useAuth0();

  const startDateTime: Date = new Date(props.itineraryData.start_time);
  const endDateTime: Date = new Date(props.itineraryData.end_time);

  return (
    <Card variant={'outline'}>
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
          <Heading size="xs">{props.itineraryData.created_by}</Heading>
          </Box>
      </CardHeader>
      <CardBody>
        <Heading size={'sm'}>Description:</Heading>
        <Text>{props.itineraryData.description}</Text>

      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <EditButton
            aria-label="edit itinerary details"
            editHandler={() => console.log('TODO')}
          />
          <TrashButton
            aria-label="delete itinerary stop"
            deleteHandler={() => handleItineraryDelete(props.itineraryData.id)}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );

  async function handleItineraryDelete(itinerary_id: number) {
    try {
      const token: string = await fetchHelpers.getAuth0Token(getAccessTokenSilently);
      const res: Response = await fetch(
        `/trip/${props.tripData.id}/itinerary/${itinerary_id}`,
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
