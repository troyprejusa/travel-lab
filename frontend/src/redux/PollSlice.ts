import { Slice, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PollResponseModel, PollVoteModel, PollVoteSendModel} from "../utilities/Interfaces";
import fetchHelpers from "../utilities/fetchHelpers";

// For now, the creation of polls will not be real time.
// Only the voting will be real time.

export const reduxFetchPolls = createAsyncThunk('messages/reduxFetchPolls',
    async (trip_id: string, thunkAPI) => {
        try {
            const res: Response = await fetch(`/trip/${trip_id}/poll`, {
                method: 'GET',
                headers: fetchHelpers.getTokenHeader()
            });

            if (res.ok) {
                const pollData: Array<PollResponseModel> = await res.json();
                // console.log(pollData)
                return pollData;
                
            } else {
                const errorRes = await res.json();
                throw errorRes;
            }

        } catch (error: any) {
            thunkAPI.rejectWithValue(error);
        }
    }
);

const initialPollState: Array<PollResponseModel> = []

const pollSlice: Slice = createSlice({
    name: 'polls',  // messages/<action_name>
    initialState: initialPollState,
    reducers: {

        // polls/reduxSetPolls
        // reduxSetPolls: (state, action: PayloadAction<Array<PollResponseModel>>) => {
        //     return action.payload;
        // },

        // polls/reduxAddPoll
        // reduxAddPoll: (state, action: PayloadAction<PollResponseModel>) => {
        //     state.push(action.payload)
        // },

        // polls/reduxAddVote
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
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(reduxFetchPolls.pending, (state, action) => {
                // polls/reduxFetchPolls/pending
                return state;   // Do nothing
            })
            .addCase(reduxFetchPolls.fulfilled, (state, action: PayloadAction<Array<PollResponseModel>>) => {
                // polls/reduxFetchPolls/fulfilled
                return action.payload;
            })
            .addCase(reduxFetchPolls.rejected, (state, action) => {
                // polls/reduxFetchPolls/rejected
                console.error('Unable to retrieve polls :( \n', action.payload);
                return state;   // Do nothing
            })
    }

})

export const { reduxAddVote,  reduxResetPolls} = pollSlice.actions;

export default pollSlice.reducer
