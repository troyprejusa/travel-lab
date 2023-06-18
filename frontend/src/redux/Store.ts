import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import tripReducer from './TripSlice';
import itineraryReducer from "./ItinerarySlice";


const store = configureStore({
    reducer: {
        user: userReducer,
        trips: tripReducer,
        itinerary: itineraryReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
