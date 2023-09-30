import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { UserModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';

export type TravellerState = Array<UserModel>;

const travellersSlice: Slice = createSlice({
  name: 'travellers', // travellers/<action_name>
  initialState: [] as TravellerState,
  reducers: {
    // travellers/reduxResetTravellers
    reduxResetTravellers: () => {
      return [] as TravellerState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchTravellers.pending, (state) => {
        // polls/reduxFetchTravellers/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchTravellers.fulfilled,
        (_state, action: PayloadAction<Array<UserModel>>) => {
          // polls/reduxFetchTravellers/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchTravellers.rejected, (state, action) => {
        // polls/reduxFetchTravellers/rejected
        console.error('Unable to retrieve travellers :(\n', action.payload);
        return state; // Do nothing
      })
      .addCase(reduxAcceptTraveller.pending, (state: TravellerState) => {
        return state;
      })
      .addCase(reduxAcceptTraveller.fulfilled, (state: TravellerState, action: PayloadAction<string>) => {
        state.forEach((traveller: UserModel) => {
          if (traveller.id === action.payload) {
            traveller.confirmed = true;
          }
        })
      })
      .addCase(reduxAcceptTraveller.rejected, (state: TravellerState, action) => {
        console.error('Unable to accept traveller :(\n', action.payload);
        return state;
      })
      .addCase(reduxRemoveTraveller.pending, (state: TravellerState) => {
        return state;
      })
      .addCase(reduxRemoveTraveller.fulfilled, (state: TravellerState, action: PayloadAction<string>) => {
        return state.filter((traveller: UserModel) => traveller.id !== action.payload);
      })
      .addCase(reduxRemoveTraveller.rejected, (state: TravellerState, action) => {
        console.error('Unable to reject traveller :(\n', action.payload);
        return state;
      })
  },
});

export const reduxFetchTravellers = createAsyncThunk(
  'messages/reduxFetchTravellers',
  async ({ trip_id, token }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/trip/${trip_id}/travellers`, {
        method: 'GET',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const travellers: Array<UserModel> = await res.json();
        // console.log(travellers)
        return travellers;
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

export const reduxAcceptTraveller = createAsyncThunk(
  'messages/reduxAcceptTraveller',
  async ({ token, trip_id, user_id }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/user/trips/${trip_id}/${user_id}`, {
        method: 'PATCH',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        return user_id;
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

export const reduxRemoveTraveller = createAsyncThunk(
  'messages/reduxRemoveTraveller',
  async ({ token, trip_id, user_id }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/user/trips/${trip_id}/${user_id}`, {
        method: 'DELETE',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        return user_id;
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

export const { reduxResetTravellers } = travellersSlice.actions;

export default travellersSlice.reducer;
