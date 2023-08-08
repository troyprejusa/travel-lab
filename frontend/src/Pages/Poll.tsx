import React, { SyntheticEvent, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { pollSocket } from '../utilities/TripSocket';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import { TripModel, UserModel } from '../Models/Interfaces';
import { RootState } from '../redux/Store';


function Poll(): JSX.Element {

    const initalPollState: Array<object> = [];
    const [pollMsgs, setPollMsgs] = useState(initalPollState);

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);

    const lis = [];
    pollMsgs.forEach((msg, i) => {
        lis.push(<li key={i}>{msg.content}</li>)
    })

    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Poll</h1>
            </Flex>
            <input type="text" id='temp_input'/>
            <button onClick={sendData}>Send data</button>

            <ol>{lis}</ol>
        </>

    )

    function sendData(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            const content: string = node.value;
            
            const data = {
                'trip_id': trip.id,
                'content': content,
                'created_by': user.email
            }

            console.log('Sending data:', data)

            pollSocket.socket.emit('frontend_poll', data)

            const pollCopy = pollMsgs.concat([data]);
            setPollMsgs(pollCopy);
            
        }

    }
}

export default Poll;