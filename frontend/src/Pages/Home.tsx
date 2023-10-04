import React from 'react';
import { Flex, Text, Grid, GridItem, Box, Heading } from '@chakra-ui/react';
import TripPhoto from '../assets/tripphoto.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import Constants from '../utilities/Constants';
import {
  ItineraryModel,
  PackingModel,
  TripModel,
  UserModel,
} from '../utilities/Interfaces';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../Components/StatsCard';
import { FiMapPin, FiTerminal, FiUser, FiShoppingBag } from 'react-icons/fi';
import TitleBar from '../Components/TitleBar';

function Home(): JSX.Element {
  const navigate: Navigate = useNavigate();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const itinerary: Array<ItineraryModel> = useSelector(
    (state: RootState) => state.itinerary
  );
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );
  const polls: Array<PollResponseModel> = useSelector(
    (state: RootState) => state.polls
  );
  const packing: Array<PackingModel> = useSelector(
    (state: RootState) => state.packing
  );
  return (
    <>
      <TitleBar text='Home'/>

      <Flex justifyContent={'center'} overflow={'scroll'}>
        <Grid
          w="120vh"
          h={'80vh'}
          templateRows="repeat(6, 1fr)"
          templateColumns="repeat(9, 1fr)"
          gap={4}
        >
          <GridItem
            rowSpan={4}
            colSpan={3}
            padding={4}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
          >
            <Flex flexDirection={'column'} height="100%" gap={8}>
              <Box>
                <Heading size="lg">{trip.destination}</Heading>
                <Text
                  color={'green.500'}
                  textTransform={'uppercase'}
                  fontWeight={800}
                  fontSize={'sm'}
                  letterSpacing={1.1}
                >
                  {trip.start_date} | {trip.end_date}
                </Text>
              </Box>
              <Box>
                <Heading size={'sm'}>Description:</Heading>
                <Text color={'gray.500'}>{trip.description}</Text>
              </Box>
              <Box>
                <Heading size={'sm'}>Created by:</Heading>
                <Text color={'gray.500'}>{trip.created_by}</Text>
              </Box>
              <Box>
                <Heading size={'sm'}>Details:</Heading>
                <Text color={'gray.500'}>{`Trip id: ${trip.id}`}</Text>
                <Text color={'gray.500'}>{`Created: ${new Date(trip.created_at).toDateString()}`}</Text>
              </Box>
            </Flex>
          </GridItem>
          <GridItem
            rowSpan={4}
            colSpan={6}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
          >
            <img
              src={TripPhoto}
              alt={'trip'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '6px',
              }}
            />
          </GridItem>
          <GridItem
            rowSpan={2}
            colSpan={3}
            padding={4}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
            cursor={'pointer'}
            onClick={() => {
              navigate('../itinerary');
            }}
          >
            <StatsCard
              title="Itinerary Stops"
              stat={itinerary.length}
              icon={<FiMapPin />}
            />
          </GridItem>
          <GridItem
            rowSpan={2}
            colSpan={3}
            padding={4}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
            cursor={'pointer'}
            onClick={() => {
              navigate('../travellers');
            }}
          >
            <StatsCard
              title="Travellers"
              stat={travellers.filter((user: UserModel) => user.confirmed).length}
              icon={<FiUser />}
            />
            <StatsCard
              title="Pending travellers"
              stat={travellers.filter((user: UserModel) => !user.confirmed).length}
              icon={<FiUser />}
            />
          </GridItem>
          <GridItem
            rowSpan={1}
            colSpan={3}
            padding={4}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
            cursor={'pointer'}
            onClick={() => {
              navigate('../packing');
            }}
          >
            <StatsCard
              title="Packing items"
              stat={packing.length}
              icon={<FiShoppingBag />}
            />
          </GridItem>
          <GridItem
            rowSpan={1}
            colSpan={3}
            padding={4}
            borderRadius="md"
            boxShadow="sm"
            background={Constants.BACKGROUND_TRANSPARENCY}
            cursor={'pointer'}
            onClick={() => {
              navigate('../poll');
            }}
          >
            <StatsCard
              title="Polls"
              stat={polls.length}
              icon={<FiTerminal />}
            />
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
}

export default Home;
