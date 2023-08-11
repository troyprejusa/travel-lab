import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import tripReducer from './TripSlice';
import messageReducer from './MessageSlice';
import pollReducer from './PollSlice';


const store = configureStore({
    reducer: {
        user: userReducer,
        trip: tripReducer,
        messages: messageReducer,
        polls: pollReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
