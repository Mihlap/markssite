import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const host = process.env.REACT_APP_DEV_HOST;

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    categoryId: "Руководство",
    selectedCardId: null,
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
    selectCard(state, action) {
      state.selectedCardId = action.payload;
      state.selectedCard = state.staff.find((staff) => staff.id === action.payload);
      },
      setCategoryId(state, action) {
        state.categoryId = action.payload;
      },
  },
});

export const { fetchStaffStart, fetchStaffSuccess, fetchStaffFailure, selectCard, setCategoryId } =
  staffSlice.actions;

export const fetchCategoryStaff =
  (categoryId) => async (dispatch, getState) => {
    const { selectedCardId } = getState().staff;
    dispatch(fetchStaffStart());

    try {
      const response = await axios.get(
        `${host}/api/staffs?category=${categoryId}`
      );
      const {
        data: { data: staff },
      } = response;
      const filteredData = staff.filter(
        (staff) => staff.attributes.categorie === categoryId
      );
    
     dispatch(fetchStaffSuccess(filteredData));
     dispatch(setCategoryId(categoryId));

    } catch (error) {
      dispatch(fetchStaffFailure(error));
    }
  };

export default staffSlice.reducer;
