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
};

const userSlice: Slice = createSlice({
  name: 'user', // user/<action_name>
  initialState: emptyUser,
  reducers: {
    // user/reduxUserLogin
    // reduxUserLogin: (state, action: PayloadAction<UserModel>) => {
    //   state.id = action.payload.id;
    //   state.first_name = action.payload.first_name;
    //   state.last_name = action.payload.last_name;
    //   state.email = action.payload.email;
    //   state.phone = action.payload.phone;
    // },

    // user/reduxUserLogout
    reduxUserLogout: (state, action: PayloadAction<null>) => {
      return emptyUser;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(reduxFetchUser.pending, (state, action) => {
        // user/reduxFetchUser/pending
        return state;   // Do nothing
      })
      .addCase(reduxFetchUser.fulfilled, (state, action: PayloadAction<UserModel>) => {
        // user/reduxFetchUser/fulfilled
        return action.payload;
      })
      .addCase(reduxFetchUser.rejected, (state, action) => {
        // user/reduxFetchUser/rejected
        return state; // Do nothing
      });
  },
});

export const reduxFetchUser = createAsyncThunk(
  'user/reduxFetchUser',
  async ({email, token}, thunkAPI) => {
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
