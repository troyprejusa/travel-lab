import { MessageModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';
import { createStandaloneToast } from '@chakra-ui/react';

import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';

const { toast } = createStandaloneToast();

export type MessageState = Array<MessageModel>;

const messageSlice: Slice = createSlice({
  name: 'messages', // messages/<action_name>
  initialState: [] as MessageState,
  reducers: {
    // messages/reduxSetMessages
    // reduxSetMessages: (state, action: PayloadAction<Array<MessageModel>>) => {
    //     return action.payload;
    // },

    // messages/reduxAddMessage
    reduxAddMessage: (state, action: PayloadAction<MessageModel>) => {
      state.push(action.payload);
    },

    // messages/reduxResetMessages
    reduxResetMessages: () => {
      return [] as MessageState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchMessages.pending, (state) => {
        // messages/reduxFetchMessages/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchMessages.fulfilled,
        (_state, action: PayloadAction<Array<MessageModel>>) => {
          // messages/reduxFetchMessages/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchMessages.rejected, (state, action) => {
        // messages/reduxFetchMessages/rejected
        console.error(action.payload);
        toast({
          position: 'top',
          title: 'Unable to retrieve messages :(',
          description: 'Something went wrong...',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return state; // Do nothing
      });
  },
});

export const reduxFetchMessages = createAsyncThunk<
  Array<MessageModel>,
  { trip_id: string; token: string }
>('messages/reduxFetchMessages', async ({ trip_id, token }, thunkAPI) => {
  try {
    const res: Response = await fetch(`/trip/${trip_id}/message`, {
      method: 'GET',
      headers: fetchHelpers.getTokenHeader(token),
    });

    if (res.ok) {
      const messages: Array<MessageModel> = await res.json();
      // console.log(messages);
      return messages;
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

export const { reduxAddMessage, reduxResetMessages } = messageSlice.actions;

export default messageSlice.reducer;
