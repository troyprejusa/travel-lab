import io, { Socket } from 'socket.io-client';
import { reduxAddMessage } from '../redux/MessageSlice';
import { reduxAddPoll, reduxAddVote, reduxDeletePoll } from '../redux/PollSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { MessageWS, MessageModel, PollVoteWS, PollDeleteWS, NewPollModel, PollResponseModel } from './Interfaces';
import Constants from './Constants';

class TripSocket {
  protected host: string;
  protected apiPath: string;
  protected namespace: string;
  protected socket: Socket | undefined;
  protected dispatch: Dispatch | undefined;

  constructor(host: string, apiPath: string, namespace: string) {
    this.host = host;
    this.apiPath = apiPath;
    this.namespace = namespace;
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    this.dispatch = dispatcher;

    // If we already have a connection, let's disconnect since we
    // are potentially switching trips when we get to here
    this.socket?.disconnect();

    this.socket = io(this.host + this.namespace, {
      reconnectionDelayMax: 5000,
      path: this.apiPath,
      auth: {
        token: token,
      },
      query: {
        trip_id: trip_id,
      },
    });
  }

  disconnectSocket() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }
}

class MessageSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    // Create event handlers for this
    this.socket!.on('backend_msg', (data: MessageModel) => {
      this.dispatch!(reduxAddMessage(data));
    });

    // Create event handlers for this
    this.socket!.on('backend_msg_error', (data: any) => {
      console.error('MessageSocket: Unable to post message :(');
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

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    this.socket!.on('backend_poll_create', (data: PollResponseModel) => {
      this.dispatch!(reduxAddPoll(data));
    });

    this.socket!.on('backend_poll_create_error', (data) => {
      console.error('PollSocket: Unable to create poll :(');
    });

    this.socket!.on('backend_poll_delete', (data: number) => {
      this.dispatch!(reduxDeletePoll(data));
    });

    this.socket!.on('backend_poll_delete_error', (data) => {
      console.error('PollSocket: Unable to delete poll :(');
    });

    this.socket!.on('backend_vote', (data: PollVoteWS) => {
      this.dispatch!(reduxAddVote(data));
    });

    this.socket!.on('backend_vote_error', (data: any) => {
      console.error('PollSocket: Unable to post vote :(');
    });
  }

  sendPoll(poll: any) {
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

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    this.socket!.on('backend_itinerary_create', (data: any) => {
      this.dispatch!(reduxAddItinerary(data));
    });

    this.socket!.on('backend_itinerary_create_error', (data: any) => {
      console.error('ItinerarySocket: Unable to add stop :(');
    });

    this.socket!.on('backend_itinerary_delete', (data: any) => {
      this.dispatch!(reduxDeleteItinerary(data));
    });

    this.socket!.on('backend_itinerary_delete_error', (data: any) => {
      console.error('ItinerarySocket: Unable to delete stop :(');
    });
  }

  sendItinerary(itinerary: any) {
    this.socket!.emit('frontend_itinerary_create', itinerary);
  }

  deleteItinerary(itinerary_id: number) {
    this.socket!.emit('frontend_itinerary_delete', itinerary_id);
  }
}

class PackingSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    this.socket!.on('backend_packing_create', (data: any) => {
      this.dispatch!(reduxAddItem(data));
    });

    this.socket!.on('backend_packing_create_error', (data: any) => {
      console.error('PackingSocket: Unable to do something :(');
    });

    this.socket!.on('backend_packing_claim', (data: any) => {
      this.dispatch!(reduxClaimItem(data));
    });

    this.socket!.on('backend_packing_claim_error', (data: any) => {
      console.error('PackingSocket: Unable to do something :(');
    });

    this.socket!.on('backend_packing_unclaim', (data: any) => {
      this.dispatch!(reduxUnclaimItem(data));
    });

    this.socket!.on('backend_packing_unclaim_error', (data: any) => {
      console.error('PackingSocket: Unable to do something :(');
    });

    this.socket!.on('backend_packing_delete', (data: any) => {
      this.dispatch!(reduxDeleteItem(data));
    });

    this.socket!.on('backend_packing_delete_error', (data: any) => {
      console.error('PackingSocket: Unable to do something :(');
    });
  }

  sendItem(item_id: number) {
    this.socket!.emit('frontend_packing_create', item_id);
  }

  claimItem(item_id: number) {
    this.socket!.emit('frontend_packing_claim', item_id);
  }

  unclaimItem(item_id: number) {
    this.socket!.emit('frontend_packing_unclaim', item_id);
  }

  deleteItem(item_id: number) {
    this.socket!.emit('frontend_packing_delete', item_id);
  }
}

const host: string = `wss://${Constants.PROXY_HOST}:${Constants.PROXY_PORT}`;
const apiPath: string = '/sio/socket.io';

export const msgSocket = new MessageSocket(host, apiPath, '/message');
export const pollSocket = new PollSocket(host, apiPath, '/poll');
export const itinerarySocket = new ItinerarySocket(host, apiPath, '/itinerary');
export const packingSocket = new PackingSocket(host, apiPath, '/packing');
