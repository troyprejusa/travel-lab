import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";

// For now, it's not important to have the creation of polls be real time
// I just want voting to be real time.

interface PollState {

}

const i: Array<MessageModel> = [];

const pollSlice: Slice = createSlice({
    name: 'polls',  // state.polls
    initialState: initialMessageState,
    reducers: {

        reduxSetPolls: (state, action: PayloadAction<Array<MessageModel>>) => {
            return action.payload;
        },

        reduxAddPolls: (state, action: PayloadAction<MessageModel>) => {
            state.push(action.payload);
        },

        reduxResetPolls: (state, action: PayloadAction<null>) => {
            return [];
        }
    }

})

export const { reduxSetMessages, reduxAddMessage, reduxResetMessages } = pollSlice.actions;

export default pollSlice.reducer
