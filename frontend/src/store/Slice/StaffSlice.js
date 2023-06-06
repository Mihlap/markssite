import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

 const host = process.env.REACT_APP_DEV_HOST;


const staffSlice = createSlice({
    name: "staff",
    initialState: {
        staff: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchStaffStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchStaffSuccess(state, action) {
            state.loading = false;
            state.staff = action.payload;
        },
        fetchStaffFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchStaffStart,
    fetchStaffSuccess,
    fetchStaffFailure,
} = staffSlice.actions;



export const fetchStaff = () => async (dispatch) => {
    dispatch(fetchStaffStart());
    
    try {
        const response = await axios.get(`${host}/api/staffs`);
        dispatch(fetchStaffSuccess(response.data.data));
    } catch (error) {
        dispatch(fetchStaffFailure(error.message));
    }
};

export default staffSlice.reducer;