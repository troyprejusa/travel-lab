import io, { Socket } from "socket.io-client"

class TripSocket {

    host: string;
    apiPath: string;
    namespace: string;
    socket: Socket;

    constructor(host: string, apiPath: string, namespace: string) {
        this.host = host;
        this.apiPath = apiPath;
        this.namespace = namespace;
    }

    establishSocket(token: string, trip_id: string) {
        // Have to establish the global connection, otherwise
        // namespace connections throw an error on the backend
        this.socket = io(this.host + this.namespace, {
            reconnectionDelayMax: 5000,
            path: this.apiPath,
            auth: {
                token: token
            }
        })

        this.socket.on('backend_msg', (data) => {
            console.error(data);
            alert(data)
        })

        this.socket.on('backend_poll', (data) => {
            console.error(data);
            alert(data)
        })

    }
    
}

const host: string = 'ws://localhost:8000';
const apiPath: string = '/sio/socket.io';

export const msgSocket = new TripSocket(host, apiPath, '/message')
export const pollSocket = new TripSocket(host, apiPath, '/poll');
