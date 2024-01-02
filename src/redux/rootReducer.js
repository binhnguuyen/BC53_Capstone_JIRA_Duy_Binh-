import { combineReducers } from "redux";
import userSlice from "./slices/user.slice";
import projectSlice from "./slices/project.slice";

export const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [projectSlice.name]: projectSlice.reducer,
})