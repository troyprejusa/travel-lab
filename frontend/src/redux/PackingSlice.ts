import { PackingModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';

export type PackingState = Array<PackingModel>;

const packingSlice: Slice = createSlice({
  name: 'packing', // packing/<action_name>
  initialState: [] as PackingState,
  reducers: {
    // packing/reduxResetPacking
    reduxResetPacking: () => {
      return [] as PackingState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchPacking.pending, (state) => {
        // packing/reduxFetchPacking/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchPacking.fulfilled,
        (_state, action: PayloadAction<Array<PackingModel>>) => {
          // packing/reduxFetchPacking/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchPacking.rejected, (state, action) => {
        // packing/reduxFetchPacking/rejected
        console.error('Unable to retrieve packing list :(\n', action.payload);
        return state; // Do nothing
      });
  },
});

export const reduxFetchPacking = createAsyncThunk(
  'messages/reduxFetchPacking',
  async ({trip_id, token}, thunkAPI) => {
    try {
      const res: Response = await fetch(`/trip/${trip_id}/packing`, {
        method: 'GET',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const packingData: Array<PackingModel> = await res.json();
        // console.log(packingData);
        return packingData;
      } else {
        const errorRes: any = await res.json();
        return thunkAPI.rejectWithValue(errorRes);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const { reduxResetPacking } = packingSlice.actions;

export default packingSlice.reducer;
