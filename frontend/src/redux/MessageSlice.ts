import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "../Models/Interfaces";

const initialMessageState: Array<MessageModel> = [];

const messageSlice: Slice = createSlice({
    name: 'message',  // state.message
    initialState: initialMessageState,
    reducers: {

        reduxSetMessages: (state, action: PayloadAction<Array<MessageModel>>) => {
            return action.payload;
        },

        reduxAddMessage: (state, action: PayloadAction<MessageModel>) => {
            return state.push(action.payload);
        }
    }

})

export const { reduxSetMessages, reduxAddMessage } = messageSlice.actions;

export default messageSlice.reducer
