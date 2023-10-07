import React, { useRef, useEffect } from 'react';
import { msgSocket } from '../utilities/TripSocket';
import {
  UserModel,
  TripModel,
  MessageModel,
  MessageWS,
} from '../utilities/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { ReceivedMessage, SentMessage } from '../Components/Messages';
import { Box, Textarea, Button, HStack, useToast } from '@chakra-ui/react';
import TitleBar from '../Components/TitleBar';
import PulseDot from '../Components/PulseDot';
import { ConfigurableButtonAndModal } from '../Components/Buttons';
import { useAuth0 } from '@auth0/auth0-react';
import fetchHelpers from '../utilities/fetchHelpers';
import { reduxResetMessages } from '../redux/MessageSlice';
import Constants from '../utilities/Constants';
import TitleBarOverlay from '../Components/TitleBarOverlay';

function MessageBoard(): JSX.Element {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const messages: Array<string> = useSelector(
    (state: RootState) => state.messages
  );

  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const toast = useToast();

  const msgRef = useRef<HTMLTextAreaElement>(null);
  const listDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listDivRef.current) return;
    listDivRef.current.scrollTop = listDivRef.current.scrollHeight;
  }, [messages]);

  return (
    <>
      <TitleBarOverlay>
        <ConfigurableButtonAndModal
          variant={'outline'}
          disabled={!user.admin}
          tooltipMsg={
            !user.admin ? 'Only trip admins can delete messages' : undefined
          }
          modalHeader="Delete messages"
          modalBody="Are you sure you want to delete all messages? This action cannot be undone"
          onClick={() => handleDeleteMessages()}
          position={'absolute'}
        >
          Delete messages
        </ConfigurableButtonAndModal>
      </TitleBarOverlay>
      <Box height={`calc(100vh - ${Constants.NAVBAR_TOP_PANE_HEIGHT})`}>
        <TitleBar text="Messages">
          <PulseDot />
        </TitleBar>
        <Box height={'65%'}>
          <Box
            height={'90%'}
            overflowY={'scroll'}
            margin="20px"
            ref={listDivRef}
          >
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
          <HStack height={'20%'}>
            <Textarea
              placeholder="New message"
              size="sm"
              resize={'none'}
              bg={'white'}
              borderRadius={'8px'}
              ref={msgRef}
            />
            <Button size="md" colorScheme="blue" onClick={() => sendMessage()}>
              Send
            </Button>
          </HStack>
        </Box>
      </Box>
    </>
  );

  function sendMessage() {
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

  async function handleDeleteMessages() {
    try {
      const token: string = await fetchHelpers.getAuth0Token(
        getAccessTokenSilently
      );
      const res: Response = await fetch(`/trip/${trip.id}/message`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        dispatch(reduxResetMessages(null));
      } else {
        throw new Error('Unable to delete messages');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        position: 'top',
        title: 'Unable to delete messages :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
}

export default MessageBoard;
