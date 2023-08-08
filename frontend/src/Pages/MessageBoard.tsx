import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { msgSocket } from '../utilities/TripSocket';
import { UserModel, TripModel, MessageModel } from '../Models/Interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { reduxSetMessages } from '../redux/MessageSlice';
import { RootState } from '../redux/Store';


function MessageBoard(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);

    const dispatch = useDispatch();

    useEffect(getOldMessages, [])
    
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

            const message: MessageModel = {
                trip_id: trip.id,
                content: data,
                created_by: user.email
            }

            console.log(data)
            msgSocket.socket.emit('frontend_msg', data)
            
        }

    }

    function getOldMessages() {
        (async function() {
            try {
                const res: Response = await fetch(`/${trip.id}/message`);

                console.log(res);
                const json = await res.json();

                if (res.ok) {
                    console.log(json);
                    dispatch(reduxSetMessages(json));

                } else {
                    throw new Error(json.message);
                }

            } catch (e: any) {
                console.log(e);
                // alert('Unable to retrieve messages for trip')
            }
        })()
    }
}

export default MessageBoard;