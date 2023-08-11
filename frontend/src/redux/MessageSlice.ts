import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "../utilities/Interfaces";

const initialMessageState: Array<MessageModel> = [];

const messageSlice: Slice = createSlice({
    name: 'messages',  // state.messages
    initialState: initialMessageState,
    reducers: {

        reduxSetMessages: (state, action: PayloadAction<Array<MessageModel>>) => {
            return action.payload;
        },

        reduxAddMessage: (state, action: PayloadAction<MessageModel>) => {
            state.push(action.payload);
        },

        reduxResetMessages: (state, action: PayloadAction<null>) => {
            return [];
        }
    }

})

export const { reduxSetMessages, reduxAddMessage, reduxResetMessages } = messageSlice.actions;

export default messageSlice.reducer
