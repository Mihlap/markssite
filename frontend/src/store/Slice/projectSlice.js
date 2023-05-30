import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

 const host = process.env.REACT_APP_DEV_HOST;


const projectSlice = createSlice({
    name: "project",
    initialState: {
        project: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchProjectStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchProjectSuccess(state, action) {
            state.loading = false;
            state.articles = action.payload;
        },
        fetchProjectFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchProjectStart,
    fetchProjectSuccess,
    fetchProjectFailure,
} = projectSlice.actions;



export const fetchProject = () => async (dispatch) => {
    dispatch(fetchProjectStart());
    
    try {
        const response = await axios.get(`${host}/api/projects`);
        dispatch(fetchProjectSuccess(response.data.data));
    } catch (error) {
        dispatch(fetchProjectFailure(error.message));
    }
};

export default projectSlice.reducer;