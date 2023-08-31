import React from 'react';
import fetchHelpers from '../utilities/fetchHelpers';
import { ItineraryModel, TripModel } from '../utilities/Interfaces';
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  CardFooter,
  ButtonGroup,
} from '@chakra-ui/react';
import { EditButton, TrashButton } from './Buttons';

interface ItineraryCardProps {
  itineraryData: ItineraryModel;
  tripData: TripModel;
  getItineraryCallback: () => void;
}

function ItineraryCard(props: ItineraryCardProps) {
  return (
    <Card variant={'outline'}>
      <CardHeader>
        <Heading size="md">{props.itineraryData.title}</Heading>
        <Heading size="sm">{props.itineraryData.created_by}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{props.itineraryData.description}</Text>
        <Text>{props.itineraryData.created_at}</Text>
        <Text>{props.itineraryData.start_time}</Text>
        <Text>{props.itineraryData.end_time}</Text>
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
      const res: Response = await fetch(
        `/trip/${props.tripData.id}/itinerary/${itinerary_id}`,
        {
          method: 'DELETE',
          headers: fetchHelpers.getTokenHeader(),
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
