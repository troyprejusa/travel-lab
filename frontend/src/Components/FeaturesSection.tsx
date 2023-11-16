import React from 'react';

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

// Replace test data with your own
const features = [
  {
    title: 'Organize the details',
    text: "Plan all the stops along your trip, and keep track of everyone's contact information all in one place.",
  },
  {
    title: 'Message travel group',
    text: 'Use a chat room to share messages with your group without having to leave the app.',
  },
  {
    title: 'Poll the group',
    text: 'No more arguing about what to visit. Create and vote on polls to let the group decide.',
  },
  {
    title: 'Pack collaboratively',
    text: 'Create a packing list for the group and allow your group members to contribute.',
  },
];

function FeaturesSection() {
  return (
    <Container maxW={'5xl'}>
      <SimpleGrid columns={{ base: 2 }} spacing={10} margin={{ base: 10 }}>
        {features.map((feature, i) => (
          <HStack key={`feature_${i}`} align={'top'}>
            <Box color={'green.400'} px={2}>
              <Icon as={CheckIcon} />
            </Box>
            <VStack align={'start'}>
              <Text fontWeight={600}>{feature.title}</Text>
              <Text color={'gray.600'}>{feature.text}</Text>
            </VStack>
          </HStack>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default FeaturesSection;
