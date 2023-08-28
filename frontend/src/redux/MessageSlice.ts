import { Slice, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MessageModel } from "../utilities/Interfaces";
import fetchHelpers from "../utilities/fetchHelpers";


const initialMessageState: Array<MessageModel> = [];

const messageSlice: Slice = createSlice({
    name: 'messages',  // messages/<action_name>
    initialState: initialMessageState,
    reducers: {

        // messages/reduxSetMessages
        // reduxSetMessages: (state, action: PayloadAction<Array<MessageModel>>) => {
        //     return action.payload;
        // },

        // messages/reduxAddMessage
        reduxAddMessage: (state, action: PayloadAction<MessageModel>) => {
            state.push(action.payload);
        },

        // messages/reduxResetMessages
        reduxResetMessages: (state, action: PayloadAction<null>) => {
            return [];
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(reduxFetchMessages.pending, (state, action) => {
                // messages/reduxFetchMessages/pending
                return state;   // Do nothing
            })
            .addCase(reduxFetchMessages.fulfilled, (state, action: PayloadAction<Array<MessageModel>>) => {
                // messages/reduxFetchMessages/fulfilled
                return action.payload

            })
            .addCase(reduxFetchMessages.rejected, (state, action) => {
                // messages/reduxFetchMessages/rejected
                console.error('Unable to retrieve messages :( \n', action.payload);
                return state;   // Do nothing
            })
    },

});

export const reduxFetchMessages = createAsyncThunk('messages/reduxFetchMessages',
    async (trip_id: string, thunkAPI) => {
        try {
            const res: Response = await fetch(`/trip/${trip_id}/message`, {
                method: 'GET',
                headers: fetchHelpers.getTokenHeader()
            });                

            if (res.ok) {
                const messages: Array<MessageModel> = await res.json();
                // console.log(messages);
                return messages;

            } else {
                // Error from backend
                const errorRes = await res.json();
                throw errorRes;
            }

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const { reduxAddMessage, reduxResetMessages } = messageSlice.actions;

export default messageSlice.reducer
