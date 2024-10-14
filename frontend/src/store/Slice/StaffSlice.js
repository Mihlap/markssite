import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const host = process.env.REACT_APP_SERVER_HOST;

const DEFAULT_CATEGORY = 'Руководство';

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    category: DEFAULT_CATEGORY,
    selectedCardId: null,
    selectedCard: null,
    staff: [],
    loading: false,
    error: null,
    allImagesLoaded: false,
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
          state.selectedCardId = selectedCardId;
          state.selectedCard = selectedCard || null;
    },
    setCategory(state, action) {
          state.category = action.payload;
    },
  },
});

export const { fetchStaffStart, fetchStaffSuccess, fetchStaffFailure, selectCard, setCategory } =
  staffSlice.actions;

export const fetchCategoryStaff = (category) => async (dispatch) => {
  dispatch(fetchStaffStart());

  try {

  await new Promise((resolve) => setTimeout(resolve, 500));
    
  const response = await axios.get(`${host}/api-stuffs/stuffs`);
  const staffData = response.data.map((staff) => ({
    ...staff,
    img: `${process.env.REACT_APP_S3_BUCKET_URL}/images/imageStuff/${staff.img}`,
  }));   

  dispatch(fetchStaffSuccess(staffData));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Ошибка при загрузке данных';
    dispatch(fetchStaffFailure(errorMessage));
  }
};;

export default staffSlice.reducer;
