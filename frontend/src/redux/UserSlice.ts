import {
  Slice,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { DbUserModel, UserModel } from '../utilities/Interfaces';
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
    reduxModifyUserPermissions(state, action: PayloadAction<any>) {
      // user/reduxModifyUserPermissions
      state.confirmed = action.payload.confirmed;
      state.admin = action.payload.admin;
    },

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
      })
      .addCase(reduxFetchTripPermissions.pending, (state) => {
        // user/reduxFetchTripPermissions/pending
        return state; // Do nothing
      })
      .addCase(
        reduxFetchTripPermissions.fulfilled,
        (state, action: PayloadAction<any>) => {
          // user/reduxFetchTripPermissions/fulfilled
          state.confirmed = action.payload.confirmed;
          state.admin = action.payload.admin;
        }
      )
      .addCase(reduxFetchTripPermissions.rejected, (state, action) => {
        // user/reduxFetchTripPermissions/rejected
        console.error('Unable to retrieve user permissions :(\n', action.payload);
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
        // This returns the user data directly, so we need to add the other fields to make
        // it a placeholder UserModel until we know our role in the trip we select later
        const userDb: DbUserModel = await res.json();
        // console.log(user);

        const userData: UserModel = {
          ...userDb,
          confirmed: false,
          admin: false,
        };

        return userData;
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

export const reduxFetchTripPermissions = createAsyncThunk(
  'user/reduxFetchTripPermissions',
  async ({ trip_id, token }, thunkAPI) => {
    try {
      const res: Response = await fetch(`/trip/${trip_id}/permissions`, {
        method: 'GET',
        headers: fetchHelpers.getTokenHeader(token),
      });

      if (res.ok) {
        const userPermissions = await res.json();
        // console.log(userPermissions);
        
        return userPermissions;
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
