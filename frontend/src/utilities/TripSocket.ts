import io, { Socket } from "socket.io-client"

class TripSocket {

    host: string;
    apiPath: string;
    globalSocket: Socket;
    msgSocket: Socket;
    pollSocket: Socket;

    constructor(host: string, apiPath: string) {
        this.host = host;
        this.apiPath = apiPath;
    }

    establishSocket(token: string, trip_id: string) {
        // Have to establish the global connection, otherwise
        // namespace connections throw an error on the backend
        this.globalSocket = io(this.host + '/', {
            reconnectionDelayMax: 5000,
            path: this.apiPath,
            query: {'token': token}
        })
    
        this.globalSocket.on("connect", () => {
            console.log(`Websocket connection successful for global namespace`);


            // TODO: after the global namespace works, we can connect to the namespaces

            // this.msgSocket = io(this.host + '/message', {
            //     reconnectionDelayMax: 5000,
            //     path: this.apiPath,
            //     query: {
            //         token: token,
            //         trip_id: trip_id
            //     }
            // })

            // this.msgSocket.on('connect', () => console.log('MSG: I guess this worked?'))

            // this.pollSocket = io(this.host + '/poll', {
            //     reconnectionDelayMax: 5000,
            //     path: this.apiPath,
            //     query: {
            //         token: token,
            //         trip_id: trip_id
            //     }
            // })

            // this.pollSocket.on('connect', () => console.log('POLL: I guess this worked?'))


            // });
        
        this.globalSocket.on("connect_error", (err: any) => {
            console.log('Websocket connection failed for global namespace :(');
        });
    
        this.globalSocket.on("disconnect", (err: any) => {
            console.log('Disconnecting websocket for global namespace');
        });

        // TODO: Need a way to switch rooms when a new trip is selected

    }
    
}

const host: string = 'ws://localhost:8000';
const apiPath: string = '/sio/socket.io';

export const tripSocket = new TripSocket(host, apiPath);
