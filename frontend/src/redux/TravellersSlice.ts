import { Slice, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UserModel } from "../utilities/Interfaces";
import fetchHelpers from "../utilities/fetchHelpers";

// For now, the creation of polls will not be real time.
// Only the voting will be real time.

const initialTravellersState: Array<UserModel> = []

const travellersSlice: Slice = createSlice({
    name: 'travellers',  // travellers/<action_name>
    initialState: initialTravellersState,
    reducers: {

        // travellers/reduxResetTravellers
        reduxResetTravellers: (state, action: PayloadAction<null>) => {
            return initialTravellersState;
        }

    },
    
    extraReducers: (builder) => {
        builder
            .addCase(reduxFetchTravellers.pending, (state, action) => {
                // polls/reduxFetchTravellers/pending
                return state;   // Do nothing
            })
            .addCase(reduxFetchTravellers.fulfilled, (state, action: PayloadAction<Array<UserModel>>) => {
                // polls/reduxFetchTravellers/fulfilled
                return action.payload;
            })
            .addCase(reduxFetchTravellers.rejected, (state, action) => {
                // polls/reduxFetchTravellers/rejected
                console.error('Unable to retrieve travellers :( \n', action.payload);
                return state;   // Do nothing
            })
    }

});

export const reduxFetchTravellers = createAsyncThunk('messages/reduxFetchTravellers',
    async (trip_id: string, thunkAPI) => {
        try {
            const res: Response = await fetch(`/trip/${trip_id}/travellers`, {
                method: 'GET',
                headers: fetchHelpers.getTokenHeader(),
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

export const { reduxResetTravellers } = travellersSlice.actions;

export default travellersSlice.reducer
