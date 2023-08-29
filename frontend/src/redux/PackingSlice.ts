import { Slice, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PackingModel } from "../utilities/Interfaces";
import fetchHelpers from "../utilities/fetchHelpers";

// For now, the creation of polls will not be real time.
// Only the voting will be real time.

const initialPackingState: Array<PackingModel> = []

const packingSlice: Slice = createSlice({
    name: 'packing',  // packing/<action_name>
    initialState: initialPackingState,
    reducers: {

        // packing/reduxResetPacking
        reduxResetPacking: (state, action: PayloadAction<null>) => {
            return initialPackingState;
        }

    },
    
    extraReducers: (builder) => {
        builder
            .addCase(reduxFetchPacking.pending, (state, action) => {
                // packing/reduxFetchPacking/pending
                return state;   // Do nothing
            })
            .addCase(reduxFetchPacking.fulfilled, (state, action: PayloadAction<Array<PackingModel>>) => {
                // packing/reduxFetchPacking/fulfilled
                return action.payload;
            })
            .addCase(reduxFetchPacking.rejected, (state, action) => {
                // packing/reduxFetchPacking/rejected
                console.error('Unable to retrieve packing list :( \n', action.payload);
                return state;   // Do nothing
            })
    }

})

export const reduxFetchPacking = createAsyncThunk('messages/reduxFetchPacking',
    async (trip_id: string, thunkAPI) => {
        try {
            const res: Response = await fetch(`/trip/${trip_id}/packing` , {
                method: 'GET',
                headers: fetchHelpers.getTokenHeader()
            })

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

// export const { } = packingSlice.actions;

export default packingSlice.reducer;