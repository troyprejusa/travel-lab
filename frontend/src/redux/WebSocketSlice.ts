import { Slice, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketConnectionStates {
    itinerary: boolean;
    poll: boolean;
    packing: boolean;
    message: boolean
}

interface SocketStateUpdate {
    socketName: string,
    connected: boolean
}

const initialState: SocketConnectionStates = {
  itinerary: false,
  poll: false,
  packing: false,
  message: false
};

const webSocketSlice: Slice = createSlice({
  name: 'websocket', // websocket/<action_name>
  initialState: initialState,
  reducers: {
    // websocket/reduxSetConnectionState
    reduxSetConnectionState: (state, action: PayloadAction<SocketStateUpdate>) => {
        let namespace = action.payload.socketName;
        if (namespace[0] === '/') namespace = namespace.slice(1);
        state[namespace] = action.payload.connected;
    },
  },
});

export const { reduxSetConnectionState } = webSocketSlice.actions;

export default webSocketSlice.reducer;
