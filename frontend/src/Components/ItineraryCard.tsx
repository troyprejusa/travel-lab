import { ItineraryModel, TripModel, UserModel } from '../utilities/Interfaces';
import { TrashButton } from './Buttons';
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
import { itinerarySocket } from '../utilities/TripSocket';

interface ItineraryCardProps {
  itineraryData: ItineraryModel;
}

function ItineraryCard(props: ItineraryCardProps) {
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
            {/* <EditButton
              aria-label="edit itinerary details"
              tooltipMsg="Feature in work"
              disabled={true}
            /> */}
            <TrashButton
              aria-label="delete itinerary stop"
              onClick={() =>
                itinerarySocket.deleteItinerary({
                  trip_id: trip.id,
                  itinerary_id: props.itineraryData.id,
                })
              }
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
}

export default ItineraryCard;
