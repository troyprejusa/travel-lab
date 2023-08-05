import React, { SyntheticEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';


function Poll(): JSX.Element {

    const initialText: string = '';
    const [text, setText] = useState(initialText);


    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <input type="text" id='temp_input' onClick={sendData}/>
            <button>Send data</button>
            <h2>{text}</h2>

        </>

    )

    function sendData(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            const data: string = node.value;
            
        }

    }
}

export default Poll;