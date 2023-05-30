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
const features = Array.apply(null, Array(6)).map(function (x, i) {
    return {
        id: i,
        title: 'Lorem ipsum dolor sit amet',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
    };
});

function ChakraFeatures() {
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

export default ChakraFeatures