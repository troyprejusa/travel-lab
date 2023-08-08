import io, { Socket } from "socket.io-client";
import { MessageModel } from "../Models/Interfaces";
import { reduxAddMessage } from "../redux/MessageSlice";
import { Dispatch } from "@reduxjs/toolkit";

class TripSocket {

    host: string;
    apiPath: string;
    namespace: string;
    eventHandlers: object;
    socket: Socket;
    dispatch: Dispatch

    constructor(host: string, apiPath: string, namespace: string, eventHandlers: object) {
        this.host = host;
        this.apiPath = apiPath;
        this.namespace = namespace;
        this.eventHandlers = eventHandlers;
    }

    establishSocket(token: string, trip_id: string, dispatcher: Dispatch) {

        this.dispatch = dispatcher;

        // Have to establish the global connection, otherwise
        // namespace connections throw an error on the backend
        this.socket = io(this.host + this.namespace, {
            reconnectionDelayMax: 5000,
            path: this.apiPath,
            auth: {
                'token': token
            },
            query: {
                'trip_id': trip_id
              }
        })

        for (const eventName in this.eventHandlers) {
            this.socket.on(eventName, this.eventHandlers[eventName])
        }

    }
    
}

const host: string = 'ws://localhost:8000';
const apiPath: string = '/sio/socket.io';

const msgEventHandlers: object = {

    // This must be a function not arrow function because of its
    // use of "this"
    'backend_msg': function(data: MessageModel) {
        this.dispatch(reduxAddMessage(data.content))
    }
}


export const msgSocket = new TripSocket(host, apiPath, '/message', msgEventHandlers);

const pollEventHandlers = {
    'backend_poll': (data) => {
        console.error(data);
        alert(data);
    }
}
export const pollSocket = new TripSocket(host, apiPath, '/poll', pollEventHandlers);
