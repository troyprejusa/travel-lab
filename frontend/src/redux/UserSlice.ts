import { Slice, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../utilities/Interfaces";

const emptyUser: UserModel = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
};

const userSlice: Slice = createSlice({
    name: 'user',   // user/<action_name>
    initialState: emptyUser,
    reducers: {

        // user/reduxUserLogin
        reduxUserLogin: (state, action: PayloadAction<UserModel>) => {
            state.id = action.payload.id;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
        },

        // user/reduxUserLogout
        reduxUserLogout: (state, action: PayloadAction<null>) => {
            return emptyUser;
        }
    }

})

export const { reduxUserLogin, reduxUserLogout } = userSlice.actions;

export default userSlice.reducer