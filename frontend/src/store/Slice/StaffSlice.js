import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

 const host = process.env.REACT_APP_DEV_HOST;


const staffSlice = createSlice({
    name: "staff",
    initialState: {
        categoryId: "Руководство",
        staff: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchStaffStart(state, action) {
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


export const fetchCategoryStaff = (categoryId) => async (dispatch) => {
    dispatch(fetchStaffStart(categoryId));
    
    try {
        const response = await axios.get(`${host}/api/staffs`);
        const filteredData = response.data.data.filter(
            (staff) => staff.attributes.categorie === categoryId
        );
        dispatch(fetchStaffSuccess(filteredData));
     
    } catch (error) {
        dispatch(fetchStaffFailure(error.message));
    }
};

export default staffSlice.reducer;