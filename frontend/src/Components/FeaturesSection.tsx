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
Button
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

// Replace test data with your own
const features = [
    {
        id: 0,
        title: 'Organize your itinerary',
        text: 'Plan all the stops along your trip, and share them with the group.',
    },
    {
        id: 1,
        title: 'Share your transportation',
        text: 'Find out when and where everyone will arrive, so you can plan who to carpool with.',
    },
    {
        id: 2,
        title: 'Message travel group',
        text: 'Use a message board to share messages with your group without leaving the app.',
    },
    {
        id: 3,
        title: 'Poll the group',
        text: 'No more arguing about what to visit, vote on polls to let the group decide.',
    },
    {
        id: 4,
        title: 'Pack collaboratively',
        text: 'Create a packing list for the group and allow your group members to contribute.',
    },
    {
        id: 5,
        title: 'Manage contact information',
        text: 'Keep track of everyone\'s contact information all in one place.',
    }
];

function FeaturesSection() {
    return (
        <Container maxW={'5xl'}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Stack
                    textAlign={'center'}
                    align={'center'}
                    spacing={{ base: 8, md: 10 }}
                    paddingY={{ base: 10 }}>
                    <Heading
                    fontWeight={600}
                    fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}>
                    Planning a group trip{' '}
                    <Text as={'span'} color={'orange.400'}>
                        simplified
                    </Text>
                    </Heading>
                </Stack>
                <Text color={'gray.600'} fontSize={'xl'} marginY={{ base: 6, md: 14 }}>
                    Collaborate with your travel partners to organize the details of your trip.
                </Text>
            </Stack>

            <SimpleGrid columns={{ base: 2 }} spacing={10} margin={{ base: 10 }}>
            {features.map((feature) => (
                <HStack key={feature.id} align={'top'}>
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

export default FeaturesSection