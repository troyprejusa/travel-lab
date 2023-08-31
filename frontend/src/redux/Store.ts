import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import tripReducer from './TripSlice';
import travellersReducer from './TravellersSlice';
import itineraryReducer from './ItinerarySlice';
import messageReducer from './MessageSlice';
import pollReducer from './PollSlice';
import packingReducer from './PackingSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    trip: tripReducer,
    travellers: travellersReducer,
    itinerary: itineraryReducer,
    messages: messageReducer,
    polls: pollReducer,
    packing: packingReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
