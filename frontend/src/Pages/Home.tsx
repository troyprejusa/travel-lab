
import { Flex, Text, Grid, GridItem, Box, Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import Constants from '../utilities/Constants';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import StatsCard from '../Components/StatsCard';
import {
  FiMapPin,
  FiUser,
  FiShoppingBag,
  FiMap,
  FiUsers,
  FiCheckCircle,
} from 'react-icons/fi';
import TitleBar from '../Components/TitleBar';
import {
  ItineraryModel,
  PackingModel,
  TripModel,
  UserModel,
  PollResponseModel,
  PollVoteModel,
} from '../utilities/Interfaces';

const ICON_SIZE: string = '24px';

function Home(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const user: UserModel = useSelector((state: RootState) => state.user);
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

  // Calculate how many polls this user voted on
  let userVotes: number = 0;
  polls.forEach((poll: PollResponseModel) => {
    poll.options.forEach((option: PollVoteModel) => {
      option.votes.forEach((voter: string) => {
        if (voter === user.email) {
          userVotes += 1;
        }
      });
    });
  });

  return (
    <>
      <TitleBar text="Home" />

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
                <Heading size={'sm'}>Trip id:</Heading>
                <Text color={'gray.500'}>{trip.id}</Text>
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
              src={Constants.PHOTO_MAP[trip.vacation_type]}
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
            <Flex flexDirection={'column'} height={'100%'}>
              <StatsCard
                title="Itinerary stops"
                stat={itinerary.length.toString()}
                icon={<FiMap fontSize={ICON_SIZE} />}
              />
              <StatsCard
                title="Stops you created"
                stat={
                  itinerary.filter((stop) => stop.created_by === user.email)
                    .length.toString()
                }
                icon={<FiMapPin fontSize={ICON_SIZE} />}
              />
            </Flex>
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
            <Flex flexDirection={'column'} height={'100%'}>
              <StatsCard
                title="Confirmed travellers"
                stat={
                  travellers.filter((user: UserModel) => user.confirmed).length.toString()
                }
                icon={<FiUsers fontSize={ICON_SIZE} />}
              />
              <StatsCard
                title="Pending travellers"
                stat={
                  travellers.filter((user: UserModel) => !user.confirmed).length.toString()
                }
                icon={<FiUser fontSize={ICON_SIZE} />}
              />
            </Flex>
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
              title="Total packing items claimed"
              stat={`${
                packing.filter((item: PackingModel) => item.packed_by).length
              } | ${packing.length}`}
              icon={<FiShoppingBag fontSize={ICON_SIZE} />}
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
              title="Polls you've responded to"
              stat={`${userVotes} | ${polls.length}`}
              icon={<FiCheckCircle fontSize={ICON_SIZE} />}
            />
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
}

export default Home;
