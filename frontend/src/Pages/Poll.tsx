import React, { SyntheticEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';


function Poll(): JSX.Element {


    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <input type="text" id='temp_input'/>
            <button onClick={sendData}>Send data</button>

        </>

    )

    function sendData(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            console.log('i did a thing')
            const data: string = node.value;
            console.log(data)
            pollSocket.socket.emit('frontend_poll', data)
            
        }

    }
}

export default Poll;