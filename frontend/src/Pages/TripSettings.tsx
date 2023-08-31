import React from 'react';
import { Flex, Text, Divider, Box } from '@chakra-ui/react';

function TripSettings(): JSX.Element {
  return (
    <>
      <Flex justifyContent={'center'}>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Trip Settings
        </Text>
      </Flex>
      <Box>
        <h2>Leave trip</h2>
      </Box>
      <Divider />
      <h1>ADMIN ONLY</h1>
      <Box>
        <h2>Remove travellers</h2>
      </Box>
      <Box>
        <h2>Delete trip</h2>
      </Box>
    </>
  );
}

export default TripSettings;
