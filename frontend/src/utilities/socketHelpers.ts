import io, { Socket } from "socket.io-client"

class TripSocket {
    // Singleton class
    socket: Socket;
    static instance: TripSocket | null = null;

    constructor(token: string) {
        if (TripSocket.instance) {
            throw new Error('Singleton instance already exists, get singleton with getTripSocket()');
        }

        const socket: Socket = io('ws://localhost:8000/', {
            reconnectionDelayMax: 5000,
            path: '/sio/socket.io'
        })
    
        socket.on("connect", () => {
            console.log('Successfully connected to the server');
            socket.emit('authenticate', {
                'token': token
            });
            });
        
        socket.on("connect_error", (err) => {
            console.log('Websocket connection failed :(');
        });
    
        socket.on("disconnect", (err) => {
            console.log('Disconnecting from socket');
        });
    
        socket.on("authenticated_user", () => {
            console.log('Authenticated user')
        })

        this.socket = socket;

        TripSocket.instance = this;

    }

    static getTripSocket() {
        if (!TripSocket.instance) {
            throw new Error('TripSocket singleton has no instance yet')
        }

        return TripSocket.instance
    }
    
}

export default TripSocket;
