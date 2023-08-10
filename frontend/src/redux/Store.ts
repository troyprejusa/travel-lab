import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import tripReducer from './TripSlice';
import messageReducer from './MessageSlice';


const store = configureStore({
    reducer: {
        user: userReducer,
        trip: tripReducer,
        messages: messageReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
