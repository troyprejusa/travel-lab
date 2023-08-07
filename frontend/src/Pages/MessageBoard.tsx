import React from 'react';
import { Flex } from '@chakra-ui/react';
import { msgSocket } from '../utilities/TripSocket';


function MessageBoard(): JSX.Element {
    
    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Message</h1>
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
            msgSocket.socket.emit('frontend_msg', data)
            
        }

    }
}

export default MessageBoard;