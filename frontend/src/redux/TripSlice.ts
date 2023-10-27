import { Slice, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TripModel } from '../utilities/Interfaces';

const emptyTrip: TripModel = {
  id: '',
  destination: '',
  description: '',
  start_date: '',
  end_date: '',
  vacation_type: '',
  created_at: '',
  created_by: '',
};

const initialTripState: TripModel = emptyTrip;

const tripSlice: Slice = createSlice({
  name: 'trip', // trip/<action_name>
  initialState: initialTripState,
  reducers: {
    // trip/reduxSetTrip
    reduxSetTrip: (_state, action: PayloadAction<TripModel>) => {
      return action.payload;
    },

    // trip/reduxResetTrip
    reduxResetTrip: () => {
      return emptyTrip;
    },
  },
});

export const { reduxSetTrip, reduxResetTrip } = tripSlice.actions;

export default tripSlice.reducer;
