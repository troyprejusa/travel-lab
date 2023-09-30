import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { UserModel } from '../utilities/Interfaces';
import fetchHelpers from '../utilities/fetchHelpers';

const emptyUser: UserModel = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  confirmed: false,
  admin: false,
};

const userSlice: Slice = createSlice({
  name: 'user', // user/<action_name>
  initialState: emptyUser,
  reducers: {
    reduxUserLogout: () => {
      // user/reduxUserLogout
      return emptyUser;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchUser.pending, (state) => {
        // user/reduxFetchUser/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchUser.fulfilled,
        (_state, action: PayloadAction<UserModel>) => {
          // user/reduxFetchUser/fulfilled
          return action.payload;
        }
      )
      .addCase(reduxFetchUser.rejected, (state, action) => {
        // user/reduxFetchUser/rejected
        console.error('Unable to retrieve user data :(\n', action.payload);
        return state; // Do nothing
      });
  },
});

export const reduxFetchUser = createAsyncThunk(
  'user/reduxFetchUser',
  async ({ email, token }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/user/${email}`, {
        method: 'POST',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const user: UserModel = await res.json();
        // console.log(user);
        return user;
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

export const { reduxUserLogout } = userSlice.actions;

export default userSlice.reducer;
