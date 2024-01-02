import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../utils/helpers";
import { CURRENT_USER } from "../../utils/constants";

const userLocal = getLocalStorage(CURRENT_USER)

const initialState = {
    currentUser: userLocal,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, {payload}) => {
            state.currentUser = payload;
        },
    }
});

// set tên action là setCurrentUser
export const { setCurrentUser } = userSlice.actions;
export default userSlice;