import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TripModel } from "../Models/Interfaces";

export interface TripStateInterface {
    currentTrip: TripModel | null,
    allTrips: Array<TripModel>
}

const tripState: TripStateInterface = {
    currentTrip: null,
    allTrips: []
};

const tripSlice: Slice = createSlice({
    name: 'trips',  // state.trips
    initialState: tripState,
    reducers: {

        replaceTrips: (state, action: PayloadAction<Array<TripModel>>) => {
            /* NOTE: 
            Due to RTK's use of the 'Immer' library, modifying the state of an object
            or array means you either modifying the object or array in place, or
            RETURN a whole new object or array as your state. Doing state = some_other_array
            does nothing */

            // state = action.payload // -> doesn't work
            
            // This works!
            state.allTrips.length = 0;   // clear the existing array
            state.allTrips.push(...action.payload);
        },

        makeCurrentTrip: (state, action: PayloadAction<TripModel>) => {
            state.currentTrip = action.payload;
        },

        addTrip: (state, action: PayloadAction<TripModel>) => {
            state.allTrips.push(action.payload);
        }
    }

})

export const { replaceTrips, makeCurrentTrip, addTrip, removeTrip } = tripSlice.actions;

export default tripSlice.reducer