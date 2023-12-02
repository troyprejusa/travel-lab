import NewTripModal from '../Components/NewTripModal';
import JoinTripModal from '../Components/JoinTripModal';
import {
  Box,
  Center,
  Heading,
  useColorModeValue,
  VStack,
  Divider,
} from '@chakra-ui/react';

// interface TripActionCardProps {}

function TripActionCard() {
  return (
    <Center py={6}>
      <Box
        maxW={'300px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <VStack spacing={'40px'}>
          <Heading size={'md'}>Join an existing trip</Heading>
          <JoinTripModal />
          <Divider />
          <Heading size={'md'}>Create your own trip</Heading>
          <NewTripModal />
        </VStack>
      </Box>
    </Center>
  );
}

export default TripActionCard;
