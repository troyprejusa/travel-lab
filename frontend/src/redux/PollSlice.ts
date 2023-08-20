import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PollResponseModel } from "../utilities/Interfaces";

// For now, it's not important to have the creation of polls be real time
// I just want voting to be real time.

const initialPollState: Array<PollResponseModel> = []

const pollSlice: Slice = createSlice({
    name: 'polls',  // state.polls
    initialState: initialPollState,
    reducers: {

        reduxSetPolls: (state, action: PayloadAction<Array<PollResponseModel>>) => {
            return action.payload;
        },

        reduxAddPoll: (state, action: PayloadAction<PollResponseModel>) => {
            state.push(action.payload)
        },

        reduxAddVote: (state, action: PayloadAction<PollVoteModel>) => {
            // TODO: This logic isn't right!
            state.poll_votes.push(action.payload);
        },

        reduxResetPolls: (state, action: PayloadAction<null>) => {
            return initialPollState;
        }
    }

})

export const { reduxSetPolls, reduxAddPoll, reduxAddVote,  reduxResetPolls} = pollSlice.actions;

export default pollSlice.reducer
