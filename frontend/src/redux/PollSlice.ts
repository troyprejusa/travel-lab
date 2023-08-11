import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PollModel, PollOptionModel, PollVoteModel } from "../utilities/Interfaces";

// For now, it's not important to have the creation of polls be real time
// I just want voting to be real time.

export interface PollState {
    polls: Array<PollModel>;
    pollOptions: Array<PollOptionModel>;
    pollVotes: Array<PollVoteModel>

}

const initialPollState: PollState = {
    polls: [],
    pollOptions: [],
    pollVotes: []
}

const pollSlice: Slice = createSlice({
    name: 'polls',  // state.polls
    initialState: initialPollState,
    reducers: {

        reduxSetPollData: (state, action: PayloadAction<PollState>) => {
            return action.payload;
        },

        reduxAddVote: (state, action: PayloadAction<PollVoteModel>) => {
            state.pollVotes.push(action.payload);
        },

        reduxResetPolls: (state, action: PayloadAction<null>) => {
            return initialPollState;
        }
    }

})

export const { reduxSetMessages, reduxAddMessage, reduxResetMessages } = pollSlice.actions;

export default pollSlice.reducer
