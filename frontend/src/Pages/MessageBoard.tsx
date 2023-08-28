import React from 'react';
import { Flex } from '@chakra-ui/react';
import { msgSocket } from '../utilities/TripSocket';
import { UserModel, TripModel, MessageModel } from '../utilities/Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';


function MessageBoard(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const messages: Array<string> = useSelector((state: RootState) => state.messages);
    
    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Message</h1>
            </Flex>
            <input type="text" id='temp_input'/>
            <button onClick={sendMessage}>Send message</button>
            <ul>
                {messages.length === 0 ?
                <li>No messages yet...</li> : messages.map((msg: MessageModel, i: number) => <li key={i}>{msg.content}</li>)}
            </ul>
        </>

    )

    function sendMessage(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            const data: string = node.value;

            const message: MessageModel = {
                trip_id: trip.id,
                content: data,
                created_by: user.email
            }

            // console.log('Sending message:', message)
            msgSocket.socket.emit('frontend_msg', message)
        }
    }
}

export default MessageBoard;