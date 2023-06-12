import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/Interfaces";

const userState: UserModel = {
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null
}

const userSlice: Slice = createSlice({
    name: 'user',
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
            state.id = null;
            state.first_name = null;
            state.last_name = null;
            state.email = null;
            state.phone = null;
        }
    }

})

export const { login, logout } = userSlice.actions;

export default userSlice.reducer