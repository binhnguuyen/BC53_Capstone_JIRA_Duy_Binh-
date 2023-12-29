import { combineReducers } from "redux";
import userSlice from "./slices/user.slice";

export const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
})