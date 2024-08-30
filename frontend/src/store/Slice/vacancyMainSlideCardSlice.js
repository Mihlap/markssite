import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const postVacancyData = createAsyncThunk(
  'slides/postVacancyData',
  async (formData, { rejectWithValue }) => {
    try {
        const serializedData = JSON.stringify({
        photoAva: formData.photoAva || '',
        card1: formData.card1,
        card2: formData.card2,
        card3: formData.card3,
      });
      console.log("Данные перед отправкой:", serializedData);
      
      const response = await axios.post(`${serverHost}/api-vacancyDetails/save-vacancy-details`, {
        details: serializedData,
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSlides = createAsyncThunk(
  'slides/fetchSlides',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api-vacancyDetails/get-slides`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении данных: ' + error.message);
    }
  }
);

export const editSlide = createAsyncThunk(
  'slides/editSlide',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-vacancyDetails/update-slide/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении слайда: ' + error.message);
    }
  }
);

export const toggleSlideVisibility = createAsyncThunk(
  'slides/toggleSlideVisibility',
  async ({ id, hidden }, { rejectWithValue }) => {
    console.log(`Отправка запроса на изменение видимости для слайда с ID ${id} на значение ${hidden}`);
    try {
      const response = await axios.patch(`/api-vacancyDetails/toggle-slide/${id}`, { hidden });
      console.log('Ответ сервера:', response.data);
      return { id, hidden: response.data.hidden };
    } catch (error) {
      console.error('Ошибка при переключении видимости слайда:', error);
      return rejectWithValue('Ошибка при переключении видимости слайда: ' + error.message);
    }
  }
);




export const deleteSlide = createAsyncThunk(
  'slides/deleteSlide',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${serverHost}/api-vacancyDetails/delete-slide/${id}`);
      return id;  
    } catch (error) {
      return rejectWithValue('Ошибка при удалении слайда: ' + error.message);
    }
  }
);

const formAddSlideSlice = createSlice({
  name: 'slides',
  initialState: {
    slides: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetSlidesState(state) {
      state.slides = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlides.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSlides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.slides = action.payload;
      })
      .addCase(fetchSlides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(postVacancyData.fulfilled, (state, action) => {
        state.slides.push(action.payload);
      })
      .addCase(editSlide.fulfilled, (state, action) => {
        const index = state.slides.findIndex((slide) => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = action.payload;
        }
      })
      .addCase(toggleSlideVisibility.fulfilled, (state, action) => {
        const index = state.slides.findIndex((slide) => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index].hidden = action.payload.hidden;
          state.slides = [...state.slides];
        }
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.slides = state.slides.filter((slide) => slide.id !== action.payload); 
        state.slides = [...state.slides];
      });
  },
});

export const { resetSlidesState } = formAddSlideSlice.actions;

export default formAddSlideSlice.reducer;
