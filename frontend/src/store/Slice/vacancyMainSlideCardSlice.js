import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

const initialState = {
  formData: {
    photoAva: '',
    card1: { description: '', date: null },
    card2: { description: '', date: null },
    card3: { description: '', date: null },
  },
  isLoading: false,
  error: null,
};

export const postVacancyData = createAsyncThunk(
  'formAddSlide/postVacancyData',
  async (formData, { rejectWithValue }) => {
    try {
        const serializedData = JSON.stringify({
        photoAva: formData.photoAva.length > 0 ? formData.photoAva[0] : '',
        card1: formData.card1,
        card2: formData.card2,
        card3: formData.card3
      });

      const response = await axios.post(`${serverHost}/api-vacancyDetails/save-vacancy-details`, {
        details: serializedData
      });

      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке данных на сервер:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const formAddSlideSlice = createSlice({
  name: 'formAddSlide',
  initialState,
  reducers: {
    resetFormData: (state) => {
      state.formData = initialState.formData;
    },
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postVacancyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postVacancyData.fulfilled, (state, action) => {
        state.isLoading = false;
       })
      .addCase(postVacancyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { resetFormData, updateFormData } = formAddSlideSlice.actions;

export default formAddSlideSlice.reducer;
