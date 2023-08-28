import { Slice, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ItineraryModel } from "../utilities/Interfaces";
import fetchHelpers from "../utilities/fetchHelpers";

const initialItineraryState: Array<ItineraryModel> = [];

const itinerarySlice: Slice = createSlice({
    name: 'itinerary',  // itinerary/<action_name>
    initialState: initialItineraryState,
    reducers: {

        // itinerary/reduxResetItinerary
        reduxResetItinerary: (state, action: PayloadAction<null>) => {
            return initialItineraryState;
        }
        
    },

    extraReducers: (builder) => {
        builder
            .addCase(reduxFetchItinerary.pending, (state, action) => {
                // messages/reduxFetchItinerary/pending
                return state;   // Do nothing
            })
            .addCase(reduxFetchItinerary.fulfilled, (state, action: PayloadAction<Array<ItineraryModel>>) => {
                // messages/reduxFetchItinerary/fulfilled
                return action.payload
            })
            .addCase(reduxFetchItinerary.rejected, (state, action) => {
                // messages/reduxFetchItinerary/rejected
                console.error('Unable to retrieve itinerary :( \n', action.payload);
                return state;   // Do nothing
            })
    }
});

export const reduxFetchItinerary = createAsyncThunk('messages/reduxFetchItinerary',
    async (trip_id: string, thunkAPI) => {
        try {
            const res: Response = await fetch(`/trip/${trip_id}/itinerary`, {
                method: 'GET',
                headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {
                const itineraryArray: Array<ItineraryModel> = await res.json();
                // console.log(itineraryArray);
                return itineraryArray;

            } else {
                // Send to rejected case
                const errorRes = await res.json();
                return thunkAPI.rejectWithValue(errorRes);
            }

        } catch (error: any) {
            // Send to rejected case
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// export const { } = itinerarySlice.actions;

export default itinerarySlice.reducer
