import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TripModel } from "../Models/Interfaces";

const tripState: Array<TripModel> = [];

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
            
            /* This works!
            state.length = 0;   // clear the existing array
            state.push(...action.payload); */

            return action.payload;  // Rhis works!
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