import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}



const authSlice = createSlice({
    name: "auth",   //asie hi post k liye bhi createSlice bna skte hai
    initialState,
    reducers: {   // reducer k ander ye jo login and logout h inko actions bolte hai
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        clearUser(state) {
            state.user = null;
          },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})



export const {login, logout, clearUser} = authSlice.actions;

export default authSlice.reducer;