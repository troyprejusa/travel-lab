import React, { SyntheticEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { tripSocket } from '../utilities/TripSocket';


function Poll(): JSX.Element {

    const initialText: string = '';
    const [text, setText] = useState(initialText);


    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <input type="text" id='temp_input'/>
            <button onClick={sendData}>Send data</button>
            <h2>{text}</h2>

        </>

    )

    function sendData(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            console.log('i did a thing')
            const data: string = node.value;
            console.log(data)
            tripSocket.pollSocket.emit('poll_msg', 'hi guys')
            
        }

    }
}

export default Poll;