import io, { Socket } from 'socket.io-client';
import { reduxAddMessage } from '../redux/MessageSlice';
import { reduxAddVote } from '../redux/PollSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { MessageModel, PollVoteSendModel } from './Interfaces';
import Constants from './Constants';

class TripSocket {
  host: string;
  apiPath: string;
  namespace: string;
  socket: Socket;
  dispatch: Dispatch;

  constructor(host: string, apiPath: string, namespace: string) {
    this.host = host;
    this.apiPath = apiPath;
    this.namespace = namespace;
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    this.dispatch = dispatcher;

    if (this.socket !== undefined) {
      // If we already have a connection, let's disconnect since we
      // are potentially switching trips when we get to here

      this.socket.disconnect();
    }

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
    this.socket.on('backend_msg', (data: MessageModel) => {
      this.dispatch(reduxAddMessage(data));
    });

    // Create event handlers for this
    this.socket.on('backend_msg_error', (data: any) => {
      console.error('MessageSocket: Unable to post message :(');
    });
  }
}

class PollSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    this.socket.on('backend_vote', (data: PollVoteSendModel) => {
      this.dispatch(reduxAddVote(data));
    });

    this.socket.on('backend_vote_error', (data: any) => {
      console.error('PollSocket: Unable to post vote :(');
    });

  }
}

class ItinerarySocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    // this.socket.on('backend_vote', (data: PollVoteSendModel) => {
    //   this.dispatch(reduxAddVote(data));
    // });
  }
}

class PackingSocket extends TripSocket {
  constructor(host: string, apiPath: string, namespace: string) {
    super(host, apiPath, namespace);
  }

  establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {
    // Make a connection to the socket using the parent method
    super.establishSocket(token, trip_id, dispatcher);

    // this.socket.on('backend_vote', (data: PollVoteSendModel) => {
    //   this.dispatch(reduxAddVote(data));
    // });
  }
}

const host: string = `wss://${Constants.PROXY_HOST}:${Constants.PROXY_PORT}`;
const apiPath: string = '/sio/socket.io';

export const msgSocket = new MessageSocket(host, apiPath, '/message');
export const pollSocket = new PollSocket(host, apiPath, '/poll');
export const itinerarySocket = new ItinerarySocket(host, apiPath, '/itinerary');
export const packingSocket = new PackingSocket(host, apiPath, '/packing');
