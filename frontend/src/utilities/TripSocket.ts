import io, { Socket } from 'socket.io-client';
import { AppDispatch } from '../redux/Store';
import { createStandaloneToast } from '@chakra-ui/react';
import {
  reduxAddItinerary,
  reduxDeleteItinerary,
} from '../redux/ItinerarySlice';
import {
  reduxAddPoll,
  reduxAddVote,
  reduxDeletePoll,
} from '../redux/PollSlice';
import { reduxAddMessage } from '../redux/MessageSlice';
import {
  reduxAddPackingItem,
  reduxClaimItem,
  reduxUnclaimItem,
  reduxDeleteItem,
} from '../redux/PackingSlice';
import { reduxSetConnectionState } from '../redux/WebSocketSlice';
import {
  MessageWS,
  MessageModel,
  PollVoteWS,
  PollDeleteWS,
  PollResponseModel,
  ItineraryDeleteWS,
  ItineraryModel,
  NewItineraryModel,
  NewPackingWS,
  PackingClaimWS,
  PackingUnclaimWS,
  PackingModel,
  PackingDeleteWS,
} from './Interfaces';

const { toast } = createStandaloneToast();

class TripSocket {
  protected host: string;
  protected apiPath: string;
  protected namespace: string;
  protected socket: Socket | undefined;
  protected dispatch: AppDispatch | undefined;
  protected trip_id: string | undefined;
  protected token: string | undefined;

  constructor(host: string, apiPath: string, namespace: string) {
    this.host = host;
    this.apiPath = apiPath;
    this.namespace = namespace;
  }

  establishSocket(token: string, trip_id: string, dispatch: AppDispatch) {
    this.token = token;
    this.trip_id = trip_id;
    this.dispatch = dispatch;

    // If we already have a connection, let's disconnect
    // in case the developer did not manually disconnect
    // before switching trips
    this.socket?.disconnect();

    this.socket = io(this.host + this.namespace, {
      reconnectionDelay: 500,
      reconnectionAttempts: 1,
      path: this.apiPath,
      auth: {
        token: token,
      },
      query: {
        trip_id: trip_id,
      },
    });

    this.socket!.on('connect', () => {
      console.log(`${this.namespace}:`, 'connected');

      this.dispatch!(
        reduxSetConnectionState({ socketName: this.namespace, connected: true })
      );

      const engine = this.socket!.io.engine;

      console.log(
        `${this.namespace} |`,
        'Socket.io engine: current transport -',
        engine.transport.name
      );

      engine.once('upgrade', () => {
        console.log(
          `${this.namespace} |`,
          'Socket.io engine: upgraded transport -',
          engine.transport.name
        );
      });

      engine.on('close', (reason) => {
        console.log(
          `${this.namespace} |`,
          'Socket.io engine: low-level connection closed\n',
          reason
        );
      });
    });

    this.socket!.on('connect_error', () => {
      console.log(`${this.namespace}:`, 'connection error');
    });

    // this.socket.io.on("reconnect_attempt", () => {
    //   console.log(`${this.namespace}:`, 'Attempting to reconnect...')

    // })

    // this.socket.io.on("reconnect", () => {
    //   console.log(`${this.namespace}:`, 'Reconnected!')
    // })

    // this.socket.io.on("reconnect_error", () => {
    //   console.log(`${this.namespace}:`, 'Error reconnecting')
    // })

    // this.socket.io.on("reconnect_failed", () => {
    //   console.log(`${this.namespace}:`, 'Reconnection failed')
    // })

    this.socket!.on('disconnect', (reason: string) => {
      /* We only need to alert the user if there was an *unexpected* disconnect from 
      the server.
      
      NOTE: When the socket is disconnected explicitly by the client or the server,
      (i.e. with .disconnect()) it will not attempt to reconnect */
      console.log(`${this.namespace}: Disconnected\n`, reason);

      this.dispatch!(
        reduxSetConnectionState({
          socketName: this.namespace,
          connected: false,
        })
      );

      if (
        reason === 'io client disconnect' ||
        reason === 'io server disconnect'
      )
        return;

      toast({
        position: 'top',
        title: `${this.namespace.slice(1)} server connection lost :(`,
        description:
          "Something went wrong, we'll try to reconnect you. If the issue persists, refresh the page",
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('rate_limit_exceeded', () => {
      toast({
        position: 'top',
        title: `Too much ${this.namespace.slice(1)} activity :(`,
        description: `You have made too many interactions in a short period. Your ${this.namespace.slice(
          1
        )} session has been disconnected. Refresh the application to continue using this service`,
        status: 'error',
        duration: null,
        isClosable: true,
      });
    });
  }

  disconnectSocket() {
    // Issue the disconnect whether the socket is connected, pending, or closed
    this.socket?.disconnect();
  }
}

class MessageSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatch: AppDispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatch);

    // Create event handlers for this
    this.socket!.on('backend_msg', (data: MessageModel) => {
      this.dispatch!(reduxAddMessage(data));
    });

    // Create event handlers for this
    this.socket!.on('backend_msg_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to send message :(',
        description: data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });
  }

  sendMessage(message: MessageWS) {
    this.socket!.emit('frontend_msg', message);
  }
}

class PollSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatch: AppDispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatch);

    this.socket!.on('backend_poll_create', (data: PollResponseModel) => {
      this.dispatch!(reduxAddPoll(data));
    });

    this.socket!.on('backend_poll_create_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to create poll :(',
        description: data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_poll_delete', (data: number) => {
      this.dispatch!(reduxDeletePoll(data));
    });

    this.socket!.on('backend_poll_delete_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to delete poll :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_vote', (data: PollVoteWS) => {
      this.dispatch!(reduxAddVote(data));
    });

    this.socket!.on('backend_vote_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to vote on this poll :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });
  }

  sendPoll(poll) {
    this.socket!.emit('frontend_poll_create', poll);
  }

  deletePoll(poll_data: PollDeleteWS) {
    this.socket!.emit('frontend_poll_delete', poll_data);
  }

  sendVote(vote: PollVoteWS) {
    this.socket!.emit('frontend_vote', vote);
  }
}

class ItinerarySocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatch: AppDispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatch);

    this.socket!.on('backend_itinerary_create', (data: ItineraryModel) => {
      this.dispatch!(reduxAddItinerary(data));
    });

    this.socket!.on('backend_itinerary_create_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to create itinerary stop :(',
        description: data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_itinerary_delete', (data: number) => {
      this.dispatch!(reduxDeleteItinerary(data));
    });

    this.socket!.on('backend_itinerary_delete_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to remove itinerary stop :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });
  }

  sendItinerary(itinerary: NewItineraryModel) {
    this.socket!.emit('frontend_itinerary_create', itinerary);
  }

  deleteItinerary(itinerary_data: ItineraryDeleteWS) {
    this.socket!.emit('frontend_itinerary_delete', itinerary_data);
  }
}

class PackingSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatch: AppDispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatch);

    this.socket!.on('backend_packing_create', (data: PackingModel) => {
      this.dispatch!(reduxAddPackingItem(data));
    });

    this.socket!.on('backend_packing_create_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to add item to packing list :(',
        description: data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_packing_claim', (data: PackingClaimWS) => {
      this.dispatch!(reduxClaimItem(data));
    });

    this.socket!.on('backend_packing_claim_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to add claim item from packing list :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_packing_unclaim', (data: PackingUnclaimWS) => {
      this.dispatch!(reduxUnclaimItem(data));
    });

    this.socket!.on('backend_packing_unclaim_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to unclaim item from packing list :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });

    this.socket!.on('backend_packing_delete', (data: number) => {
      this.dispatch!(reduxDeleteItem(data));
    });

    this.socket!.on('backend_packing_delete_error', (data) => {
      console.error(data);
      toast({
        position: 'top',
        title: 'Unable to remove item from packing list :(',
        description: 'Something went wrong...',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    });
  }

  sendItem(item_data: NewPackingWS) {
    this.socket!.emit('frontend_packing_create', item_data);
  }

  claimItem(item_data: PackingClaimWS) {
    this.socket!.emit('frontend_packing_claim', item_data);
  }

  unclaimItem(item_data: PackingUnclaimWS) {
    this.socket!.emit('frontend_packing_unclaim', item_data);
  }

  deleteItem(item_data: PackingDeleteWS) {
    this.socket!.emit('frontend_packing_delete', item_data);
  }
}

const host: string = `wss://${window.location.host}`;
const apiPath: string = '/sio/socket.io';

export const msgSocket = new MessageSocket(host, apiPath, '/message');
export const pollSocket = new PollSocket(host, apiPath, '/poll');
export const itinerarySocket = new ItinerarySocket(host, apiPath, '/itinerary');
export const packingSocket = new PackingSocket(host, apiPath, '/packing');
