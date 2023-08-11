import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { msgSocket } from '../utilities/TripSocket';
import { UserModel, TripModel, MessageModel } from '../utilities/Interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { reduxSetMessages } from '../redux/MessageSlice';
import { RootState } from '../redux/Store';
import fetchHelpers from '../utilities/fetchHelpers';


function MessageBoard(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const messages: Array<string> = useSelector((state: RootState) => state.messages);

    const dispatch = useDispatch();

    useEffect(getOldMessages, [])   // Initial render only
    
    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Message</h1>
            </Flex>
            <input type="text" id='temp_input'/>
            <button onClick={sendData}>Send data</button>
            <ul>
                {messages.length === 0 ?
                <li>No messages yet...</li> : 
                messages.map((msg: MessageModel, i: number) => <li key={i}>{msg.content}</li>)}
            </ul>
        </>

    )

    function sendData(event: SyntheticEvent) {
        const node = document.getElementById('temp_input');
        if (node) {
            const data: string = node.value;

            const message: MessageModel = {
                trip_id: trip.id,
                content: data,
                created_by: user.email
            }

            console.log('Sending message:', message)
            msgSocket.socket.emit('frontend_msg', message)
        }
    }

    function getOldMessages() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/${trip.id}/message`, {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader()
                });                

                if (res.ok) {
                    const messages: Array<MessageModel> = await res.json();
                    dispatch(reduxSetMessages(messages));

                } else {
                    const errorMsg = await res.json();
                    throw new Error(errorMsg.message);
                }

            } catch (e: any) {
                console.log(e);
                alert('Unable to retrieve messages for trip!')
            }
        })()
    }
}

export default MessageBoard;