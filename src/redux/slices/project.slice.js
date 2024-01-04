import { createSlice } from "@reduxjs/toolkit";
// import { getLocalStorage } from "../../utils/helpers";
// import { CURRENT_USER } from "../../utils/constants";

// const userLocal = getLocalStorage(CURRENT_USER)

const initialState = {
    projectList: [],
    projectIdToEdit: undefined,
}

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjectList: (state, {payload}) => {
            // console.log('payload: ', payload);
            state.projectList = payload;
        },
        setProjectIdToEdit: (state, { payload }) => {
            // console.log("payload", payload);
            state.projectIdToEdit = payload;
        },
    }
});

// set tên action là setProject
// export const { setProject } = projectSlice.actions;
export default projectSlice;

// ↓ đây là cách hay làm
export const { reducer: projectListReducer, actions: projectListAction } = projectSlice
