import fetchHelpers from '../utilities/fetchHelpers';
import { createStandaloneToast } from '@chakra-ui/react';
import Constants from '../utilities/Constants';
import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  PollResponseModel,
  PollVoteModel,
  PollVoteWS,
} from '../utilities/Interfaces';

const { toast } = createStandaloneToast();

export type PollState = Array<PollResponseModel>;

const pollSlice: Slice = createSlice({
  name: 'polls', // polls/<action_name>
  initialState: [] as PollState,
  reducers: {
    // polls/reduxAddPoll
    reduxAddPoll: (state, action: PayloadAction<PollResponseModel>) => {
      state.push(action.payload);
    },

    // polls/reduxAddVote
    reduxAddVote: (state, action: PayloadAction<PollVoteWS>) => {
      state.forEach((poll: PollResponseModel) => {
        // Find the matching poll id
        if (poll.poll_id === action.payload.poll_id) {
          poll.options.forEach((option: PollVoteModel) => {
            // Find the matching option
            if (option.option_id === action.payload.option_id) {
              option.votes.push(action.payload.voted_by);
            }
          });
        }
      });
    },

    // polls/reduxDeletePoll
    reduxDeletePoll: (state, action: PayloadAction<number>) => {
      // Filter creates a new array, which must be returned
      return state.filter(
        (poll: PollResponseModel) => poll.poll_id !== action.payload
      );
    },

    // polls/reduxResetPolls
    reduxResetPolls: () => {
      return [] as PollState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchPolls.pending, (state) => {
        // polls/reduxFetchPolls/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchPolls.fulfilled,
        (_state, action: PayloadAction<Array<PollResponseModel>>) => {
          // polls/reduxFetchPolls/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchPolls.rejected, (state, action) => {
        // polls/reduxFetchPolls/rejected
        console.error(action.payload);
        toast({
          position: 'top',
          title: 'Unable to retrieve polls :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return state; // Do nothing
      });
  },
});

export const reduxFetchPolls = createAsyncThunk<
  Array<PollResponseModel>,
  { trip_id: string; token: string }
>('polls/reduxFetchPolls', async ({ trip_id, token }, thunkAPI) => {
  try {
    const res: Response = await fetch(`${Constants.API_PREFIX}/trip/${trip_id}/poll`, {
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
});

export const { reduxAddPoll, reduxAddVote, reduxDeletePoll, reduxResetPolls } =
  pollSlice.actions;

export default pollSlice.reducer;
