import { createSlice } from "@reduxjs/toolkit";
import { CurrentUser } from "../../types/user.type";
import { getLocalStorage } from "../../utils/helpers";
import { CURRENT_USER } from "../../utils/constants";

const userLocal = getLocalStorage<CurrentUser | null>(CURRENT_USER)

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

export const { setCurrentUser } = userSlice.actions;
export default userSlice;