import React from 'react';
import { TripModel, ItineraryModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import NewItineraryModal from '../Components/NewItineraryModal';
import ItineraryCard from '../Components/ItineraryCard';
import { reduxFetchItinerary } from '../redux/ItinerarySlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Flex, Stack, Box, Button, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import TitleBar from '../Components/TitleBar';

function Itinerary(): JSX.Element {
  const dispatch = useDispatch();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const itinerary: Array<ItineraryModel> = useSelector(
    (state: RootState) => state.itinerary
  );

  const { getAccessTokenSilently } = useAuth0();

  return (
    <>
      <TitleBar text='Itinerary' />
      <Flex flexWrap={'wrap'} justifyContent={'space-around'} gap={'40px'}>
        <Stack
          spacing="4"
          height={'80vh'}
          w={'sm'}
          overflowY={'scroll'}
        >
          <NewItineraryModal getItineraryCallback={getItinerary} />
          {itinerary.length === 0 ? (
            <Text>Nothing planned...</Text>
          ) : (
            itinerary.map((itin: ItineraryModel, index: number) => (
              <ItineraryCard
                key={index}
                itineraryData={itin}
                getItineraryCallback={getItinerary}
              />
            ))
          )}
        </Stack>
        <Box minWidth='lg' width='50vw'>
          <style>{`.fc-scrollgrid {background-color: white;}`}</style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek',
            }}
            initialView="dayGridMonth"
            events={itinerary.map((stop: ItineraryModel) => {
              return {
                title: stop.title,
                start: stop.start_time,
                end: stop.end_time,
              };
            })}
            height={'80vh'}
          />
        </Box>
      </Flex>
    </>
  );

  async function getItinerary() {
    const token: string = await fetchHelpers.getAuth0Token(
      getAccessTokenSilently
    );
    dispatch(reduxFetchItinerary({ trip_id: trip.id, token: token }));
  }
}

export default Itinerary;
