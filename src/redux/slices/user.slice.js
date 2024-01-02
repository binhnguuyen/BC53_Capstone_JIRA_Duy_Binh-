import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../utils/helpers";
import { CURRENT_USER } from "../../utils/constants";

const userLocal = getLocalStorage(CURRENT_USER)

const initialState = {
    currentUser: userLocal,
    showPassword: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, {payload}) => {
            state.currentUser = payload;
        },
        setShowPassword: (state) => {
            console.log("before: ", state.showPassword)

            state.showPassword ? false : true

            console.log("after: ", state.showPassword)
        }
    }
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice;