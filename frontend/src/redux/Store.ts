import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import tripReducer from './TripSlice';


const store = configureStore({
    reducer: {
        user: userReducer,
        trip: tripReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
