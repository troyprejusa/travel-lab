import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PollResponseModel, PollVoteModel, PollVoteSendModel} from "../utilities/Interfaces";

// For now, the creation of polls will not be real time.
// Onlyh the voting will be real time.

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

        reduxAddVote: (state, action: PayloadAction<PollVoteSendModel>) => {
            const matchingPoll: number = state.findIndex((poll: PollResponseModel) => poll.poll_id === action.payload.poll_id);
            
            if (matchingPoll === -1) return

            const matchingOption: number = state[matchingPoll].options.findIndex((option: PollVoteModel) => option.option_id === action.payload.option_id);

            if (matchingOption === -1) return

            state[matchingPoll].options[matchingOption].votes.push(action.payload.voted_by);
        },

        reduxResetPolls: (state, action: PayloadAction<null>) => {
            return initialPollState;
        }
    }

})

export const { reduxSetPolls, reduxAddPoll, reduxAddVote,  reduxResetPolls} = pollSlice.actions;

export default pollSlice.reducer
