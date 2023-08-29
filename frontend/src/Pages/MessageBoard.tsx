import React, { useRef, useEffect } from 'react';
import { msgSocket } from '../utilities/TripSocket';
import { UserModel, TripModel, MessageModel } from '../utilities/Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { 
    Flex,
    UnorderedList,
    ListItem,
    Box,
    Textarea,
    Button,
    HStack,
} from '@chakra-ui/react';


function MessageBoard(): JSX.Element {

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);
    const messages: Array<string> = useSelector((state: RootState) => state.messages);

    const msgRef = useRef<HTMLTextAreaElement>(null);
    const listDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!listDivRef.current) return;
        listDivRef.current.scrollTop = listDivRef.current.scrollHeight;
    }, [])
    
    return (
        <>
            <Flex justifyContent={'center'}>
            <h1>Messages</h1>
            </Flex>
            <Box height={'80vh'}>
                <Box height={'90%'} overflowY={'scroll'} margin='20px' ref={listDivRef}>
                    <UnorderedList>
                        {messages.length === 0 ?
                        <ListItem>No messages yet...</ListItem> 
                        : 
                        messages.map((msg: MessageModel, i: number) => {
                            if (msg.created_by === user.email) {
                                return <ListItem key={i} float={'right'}>{msg.content}</ListItem>
                            } else {
                                return <ListItem key={i}>{msg.content}</ListItem>
                            }
                        })}
                    </UnorderedList>
                </Box>
                <HStack height={'10%'} margin={'20px'}>
                    <Textarea placeholder='New message' size='sm' resize={'none'} bg={'white'} ref={msgRef}/>
                    <Button size='md' colorScheme='blue' onClick={sendMessage}>Send</Button>
                </HStack>
            </Box>

        </>

    )

    function sendMessage(event: SyntheticEvent) {

        if (!msgRef.current) return;

        const messageData: string = msgRef.current.value;

        if (messageData === '') return;

        const message: MessageModel = {
            trip_id: trip.id,
            content: messageData,
            created_by: user.email
        }

        // console.log('Sending message:', message)
        msgSocket.socket.emit('frontend_msg', message);

        // Reset input field
        msgRef.current.value = '';
    }

}

export default MessageBoard;