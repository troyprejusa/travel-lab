import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TripModel } from "../Models/Interfaces";

const tripState: Array<TripModel> = [];

const tripSlice: Slice = createSlice({
    name: 'trips',  // state.trips
    initialState: tripState,
    reducers: {

        replaceTrips: (state, action: PayloadAction<Array<TripModel>>) => {
            // You must modify the state in place, reassign values!
            // state = action.payload -> DOESN'T WORK!
            state.length = 0;   // clear the existing array
            state.push(...action.payload);  
        },

        addTrip: (state, action: PayloadAction<TripModel>) => {
            state.push(action.payload);
        },

        removeTrip: (state, action: PayloadAction<TripModel>) => {
            const remIndex: number = state.tripState.findIndex((a: TripModel) => a.id === action.payload.id);
            state.splice(remIndex, 1);
        }
    }

})

export const { replaceTrips, addTrip, removeTrip } = tripSlice.actions;

export default tripSlice.reducer