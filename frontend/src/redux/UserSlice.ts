import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/Interfaces";

const userState: UserModel = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
}

const userSlice: Slice = createSlice({
    name: 'user',   // state.user
    initialState: userState,
    reducers: {
        login: (state, action: PayloadAction<UserModel>) => {
            state.id = action.payload.id;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
        },

        logout: (state) => {
            state.id = '';
            state.first_name = '';
            state.last_name = '';
            state.email = '';
            state.phone = '';
        }
    }

})

export const { login, logout } = userSlice.actions;

export default userSlice.reducer