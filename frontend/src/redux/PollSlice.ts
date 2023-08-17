import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PollModel, PollOptionModel, PollVoteModel } from "../utilities/Interfaces";

// For now, it's not important to have the creation of polls be real time
// I just want voting to be real time.

export interface PollState {
    polls: Array<PollModel>;
    poll_options: Array<PollOptionModel>;
    poll_votes: Array<PollVoteModel>
}

const initialPollState: PollState = {
    polls: [],
    poll_options: [],
    poll_votes: []
}

const pollSlice: Slice = createSlice({
    name: 'polls',  // state.polls
    initialState: initialPollState,
    reducers: {

        reduxSetPolls: (state, action: PayloadAction<PollState>) => {
            return action.payload;
        },

        reduxAddPoll: (state, action: PayloadAction<PollState>) => {
            state.polls.push(...action.payload.polls)/
            state.poll_options.push(...action.payload.poll_options);
            state.poll_votes.push(...action.payload.poll_votes);
        },

        reduxAddVote: (state, action: PayloadAction<PollVoteModel>) => {
            state.poll_votes.push(action.payload);
        },

        reduxResetPolls: (state, action: PayloadAction<null>) => {
            return initialPollState;
        }
    }

})

export const { reduxSetPolls, reduxAddPoll, reduxAddVote,  reduxResetPolls} = pollSlice.actions;

export default pollSlice.reducer
