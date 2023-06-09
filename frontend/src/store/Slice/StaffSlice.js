import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const DEFAULT_CATEGORY = "Руководство";
const host = process.env.REACT_APP_SERVER_HOST;

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    category: DEFAULT_CATEGORY,
    selectedCardId: null,
    selectedCard: null,
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
        const selectedCardId = action.payload;
        const selectedCard = state.staff.find((staff) => staff.id === selectedCardId);
      if (selectedCardId === state.selectedCardId) {
      return state;
      }
      return {
        ...state,
        selectedCardId,
        selectedCard: selectedCard ? selectedCard : null,
      };
      
      },
      setCategory(state, action) {
        state.category = action.payload;
      },
  },
});

export const {
  fetchStaffStart,
  fetchStaffSuccess,
  fetchStaffFailure,
  selectCard,
  setCategory,
} = staffSlice.actions;

export const fetchCategoryStaff =
  (category) => async (dispatch, getState) => {
    dispatch(fetchStaffStart());

    try {
      const response = await axios.get(
        `${host}/api/staffs`
      );
     
      const staff = response.data;
      const filteredData = staff.filter(
        (staff) => staff.category === category
        );
       
    
      dispatch(setCategory(category));
     dispatch(fetchStaffSuccess(filteredData));
       } catch (error) {
      dispatch(fetchStaffFailure(error.message));
    }
  };

export default staffSlice.reducer;


