import { ItineraryModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';

export type ItineraryState = Array<ItineraryModel>;

const itinerarySlice: Slice = createSlice({
  name: 'itinerary', // itinerary/<action_name>
  initialState: [] as ItineraryState,
  reducers: {
    // itinerary/reduxAddItinerary
    reduxAddItinerary: (state, action: PayloadAction<ItineraryModel>) => {
      state.push(action.payload);
    },

    // itinerary/reduxDeleteItinerary
    reduxDeleteItinerary: (state, action: PayloadAction<number>) => {
      return state.filter((itin: ItineraryModel) => itin.id !== action.payload);
    },

    // itinerary/reduxResetItinerary
    reduxResetItinerary: () => {
      return [] as ItineraryState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchItinerary.pending, (state) => {
        // messages/reduxFetchItinerary/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchItinerary.fulfilled,
        (_state, action: PayloadAction<Array<ItineraryModel>>) => {
          // messages/reduxFetchItinerary/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchItinerary.rejected, (state, action) => {
        // messages/reduxFetchItinerary/rejected
        console.error('Unable to retrieve itinerary :(\n', action.payload);
        return state; // Do nothing
      });
  },
});

export const reduxFetchItinerary = createAsyncThunk(
  'messages/reduxFetchItinerary',
  async ({ trip_id, token }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/trip/${trip_id}/itinerary`, {
        method: 'GET',
        headers: fetchHelpers.getTokenHeader(token),
      });

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

export const { reduxAddItinerary, reduxDeleteItinerary, reduxResetItinerary } =
  itinerarySlice.actions;

export default itinerarySlice.reducer;
