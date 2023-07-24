import React from 'react';
import { Flex } from '@chakra-ui/react';

interface MessageBoardProps {

};

function MessageBoard(): JSX.Element {
    return (
        <Flex justifyContent={'center'}>
            <h1>Message Board</h1>
        </Flex>
    )
}

export default MessageBoard;