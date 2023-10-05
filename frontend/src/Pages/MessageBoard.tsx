import React, { useRef, useEffect } from 'react';
import { msgSocket } from '../utilities/TripSocket';
import { UserModel, TripModel, MessageModel, MessageWS } from '../utilities/Interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { ReceivedMessage, SentMessage } from '../Components/Messages';
import { Box, Textarea, Button, HStack } from '@chakra-ui/react';
import TitleBar from '../Components/TitleBar';
import PulseDot from '../Components/PulseDot';


function MessageBoard(): JSX.Element {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const messages: Array<string> = useSelector(
    (state: RootState) => state.messages
  );

  const msgRef = useRef<HTMLTextAreaElement>(null);
  const listDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listDivRef.current) return;
    listDivRef.current.scrollTop = listDivRef.current.scrollHeight;
  }, [messages]);

  return (
    <>
      <TitleBar text='Messages'>
        <PulseDot />
      </TitleBar>
      <Box height={'80vh'}>
        <Box height={'90%'} overflowY={'scroll'} margin="20px" ref={listDivRef}>
          {messages.length === 0 ? (
            <Box>No messages yet...</Box>
          ) : (
            messages.map((msg: MessageModel, i: number) => {
              if (msg.created_by === user.email) {
                return <SentMessage key={i} {...msg} />;
              } else {
                return <ReceivedMessage key={i} {...msg} />;
              }
            })
          )}
        </Box>
        <HStack height={'10%'}>
          <Textarea
            placeholder="New message"
            size="sm"
            resize={'none'}
            bg={'white'}
            borderRadius={'8px'}
            ref={msgRef}
          />
          <Button size="md" colorScheme="blue" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </Box>
    </>
  );

  function sendMessage(event: SyntheticEvent) {
    if (!msgRef.current) return;

    const messageData: string = msgRef.current.value;

    if (messageData === '') return;

    const message: MessageWS = {
      trip_id: trip.id,
      content: messageData,
      created_by: user.email,
    };

    msgSocket.sendMessage(message);

    // Reset input field
    msgRef.current.value = '';
  }
}

export default MessageBoard;
