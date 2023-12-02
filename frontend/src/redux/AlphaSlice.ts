import { Slice, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlphaKey {
  email: string;
  key: string;
}

const initialAlphaState: AlphaKey = {
  email: '',
  key: '',
};

const alphaSlice: Slice = createSlice({
  name: 'alpha', // alpha/<action_name>
  initialState: initialAlphaState,
  reducers: {
    // alpha/setAlphaKey
    reduxSetAlphaKey: (_state, action: PayloadAction<AlphaKey>) => {
      return action.payload;
    },
  },
});

export const { reduxSetAlphaKey } = alphaSlice.actions;

export default alphaSlice.reducer;
