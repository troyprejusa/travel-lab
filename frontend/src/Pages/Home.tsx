import React from 'react';
import { Flex, Text } from '@chakra-ui/react';


function Home(): JSX.Element {

    return (
        <Flex justifyContent={'center'}>
            <Text fontSize={'xl'} fontWeight={'bold'}>Home</Text>
        </Flex>
    )
}

export default Home;