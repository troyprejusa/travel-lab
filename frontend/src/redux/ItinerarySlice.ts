import { ItineraryModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import { createStandaloneToast } from '@chakra-ui/react';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';

const { toast } = createStandaloneToast();

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
      // Filter creates a new array, which must be returned
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
        console.error(action.payload);
        toast({
          position: 'top',
          title: 'Unable to retrieve itinerary :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return state; // Do nothing
      });
  },
});

export const reduxFetchItinerary = createAsyncThunk<
  Array<ItineraryModel>,
  { trip_id: string; token: string }
>('messages/reduxFetchItinerary', async ({ trip_id, token }, thunkAPI) => {
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
  } catch (error) {
    // Send to rejected case
    return thunkAPI.rejectWithValue(error);
  }
});

export const { reduxAddItinerary, reduxDeleteItinerary, reduxResetItinerary } =
  itinerarySlice.actions;

export default itinerarySlice.reducer;
