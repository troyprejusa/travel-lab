import fetchHelpers from '../utilities/fetchHelpers';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  PollResponseModel,
  PollVoteModel,
  PollVoteSendModel,
} from '../utilities/Interfaces';

// For now, the creation of polls will not be real time.
// Only the voting will be real time.

const initialPollState: Array<PollResponseModel> = [];

const pollSlice: Slice = createSlice({
  name: 'polls', // polls/<action_name>
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
      const matchingPoll: number = state.findIndex(
        (poll: PollResponseModel) => poll.poll_id === action.payload.poll_id
      );

      if (matchingPoll === -1) return;

      const matchingOption: number = state[matchingPoll].options.findIndex(
        (option: PollVoteModel) => option.option_id === action.payload.option_id
      );

      if (matchingOption === -1) return;

      state[matchingPoll].options[matchingOption].votes.push(
        action.payload.voted_by
      );
    },

    // polls/reduxResetPolls
    reduxResetPolls: (state, action: PayloadAction<null>) => {
      return initialPollState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchPolls.pending, (state, action) => {
        // polls/reduxFetchPolls/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchPolls.fulfilled,
        (state, action: PayloadAction<Array<PollResponseModel>>) => {
          // polls/reduxFetchPolls/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchPolls.rejected, (state, action) => {
        // polls/reduxFetchPolls/rejected
        console.error('Unable to retrieve polls :( \n', action.payload);
        return state; // Do nothing
      });
  },
});

export const reduxFetchPolls = createAsyncThunk(
  'polls/reduxFetchPolls',
  async ({trip_id, token}, thunkAPI) => {
    try {
      const res: Response = await fetch(`/trip/${trip_id}/poll`, {
        method: 'GET',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const pollData: Array<PollResponseModel> = await res.json();
        // console.log(pollData)
        return pollData;
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

export const { reduxAddVote, reduxResetPolls } = pollSlice.actions;

export default pollSlice.reducer;
