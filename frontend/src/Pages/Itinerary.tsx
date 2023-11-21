
import { ItineraryModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { useSelector } from 'react-redux';
import NewItineraryModal from '../Components/NewItineraryModal';
import ItineraryCard from '../Components/ItineraryCard';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Flex, Stack, Box, Text } from '@chakra-ui/react';
import TitleBar from '../Components/TitleBar';
import Constants from '../utilities/Constants';
import PulseDot from '../Components/PulseDot';
import TitleBarOverlay from '../Components/TitleBarOverlay';
import RedAlertIcon from '../Components/RedAlertIcon';

function Itinerary(): JSX.Element {
  const itinerary: Array<ItineraryModel> = useSelector(
    (state: RootState) => state.itinerary
  );
  const itinerarySocketStatus = useSelector(
    (state: RootState) => state.websocket.itinerary
  );

  return (
    <>
      <TitleBarOverlay>
        <NewItineraryModal />
      </TitleBarOverlay>

      <TitleBar text="Itinerary">
        {itinerarySocketStatus ? <PulseDot /> : <RedAlertIcon />}
      </TitleBar>
      <Flex flexWrap={'wrap'} justifyContent={'space-around'} gap={'20px'}>
        <Stack spacing="4" height={'80vh'} w={'xs'} overflowY={'scroll'}>
          {itinerary.length === 0 ? (
            <Text>Nothing planned...</Text>
          ) : (
            itinerary.map((itin: ItineraryModel, index: number) => (
              <ItineraryCard key={index} itineraryData={itin} />
            ))
          )}
        </Stack>
        <Box minWidth="lg" width="50vw">
          <style>{`.fc-scrollgrid {background-color: ${Constants.BACKGROUND_TRANSPARENCY};}`}</style>
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
}

export default Itinerary;
