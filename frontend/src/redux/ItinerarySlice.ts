import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItineraryModel } from "../Models/Interfaces";

export type ItineraryStateInterface = Array<ItineraryModel>

const itineraryState: ItineraryStateInterface = [];

const itinerarySlice: Slice = createSlice({
    name: 'itinerary',  // state.trips
    initialState: itineraryState,
    reducers: {

        replaceItinerary: (state, action: PayloadAction<ItineraryStateInterface>) => {
            return action.payload;
        },

        addStop: (state, action: PayloadAction<ItineraryModel>) => {
            state.push(action.payload);
        }

    }

});

export const { replaceItinerary, addStop, removeStop } = itinerarySlice.actions;

export default itinerarySlice.reducer