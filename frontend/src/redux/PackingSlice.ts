import {
  PackingClaimWS,
  PackingDeleteWS,
  PackingModel,
} from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { createStandaloneToast } from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export type PackingState = Array<PackingModel>;

const packingSlice: Slice = createSlice({
  name: 'packing', // packing/<action_name>
  initialState: [] as PackingState,
  reducers: {
    // packing/reduxAddPackingItem
    reduxAddPackingItem: (state, action: PayloadAction<PackingModel>) => {
      state.push(action.payload);
    },
    // packing/reduxClaimItem
    reduxClaimItem: (state, action: PayloadAction<PackingClaimWS>) => {
      state.forEach((item: PackingModel) => {
        if (item.id === action.payload.item_id) {
          item.packed_by = action.payload.email;
        }
      });
    },
    // packing/reduxUnclaimItem
    reduxUnclaimItem: (state, action: PayloadAction<PackingDeleteWS>) => {
      state.forEach((item: PackingModel) => {
        if (item.id === action.payload.item_id) {
          item.packed_by = null;
        }
      });
    },
    // packing/reduxDeleteItem
    reduxDeleteItem: (state, action: PayloadAction<number>) => {
      // Filter creates a new array, which must be returned
      return state.filter((item: PackingModel) => item.id !== action.payload);
    },
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
        console.error(action.payload);
        toast({
          position: 'top',
          title: 'Unable to retrieve packing list :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return state; // Do nothing
      });
  },
});

export const reduxFetchPacking = createAsyncThunk(
  'messages/reduxFetchPacking',
  async ({ trip_id, token }, thunkAPI) => {
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

export const {
  reduxAddPackingItem,
  reduxClaimItem,
  reduxUnclaimItem,
  reduxDeleteItem,
  reduxResetPacking,
} = packingSlice.actions;

export default packingSlice.reducer;
