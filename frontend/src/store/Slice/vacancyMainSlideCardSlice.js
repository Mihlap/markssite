import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const postVacancyData = createAsyncThunk(
  'slides/postVacancyData',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
       const response = await axios.post(`${serverHost}/api-vacancyDetails/save-vacancy-details`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        dispatch(fetchSlides()); 
      }
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

export const fetchSlideDetails = createAsyncThunk(
  'slides/fetchSlideDetails',
  async (slideId, { rejectWithValue }) => {
      try {
          const response = await axios.get(`${serverHost}/api-vacancyDetails/get-slide/${slideId}`);
          return response.data;
      } catch (error) {
          return rejectWithValue('Ошибка при получении данных слайда: ' + error.message);
      }
  }
);


export const fetchSlideById = createAsyncThunk(
  'slides/fetchSlideById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api-vacancyDetails/get-slide/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении данных слайда: ' + error.message);
    }
  }
);



export const editSlide = createAsyncThunk(
  'slides/editSlide',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-vacancyDetails/update-slide/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        return response.data;  
      } else {
        return rejectWithValue('Не удалось обновить слайд');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении слайда: ' + error.message);
    }
  }
);


export const updateSlidesOrder = createAsyncThunk(
  'vacancyMainSlideCard/updateSlidesOrder',
  async (slides, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-vacancyDetails/update-slides-order`, {
        slides: slides.map((slide, index) => ({
          id: slide.id,
          order: index  // Сохраняем порядок для каждого слайда
        }))
      });
      return response.data; // Возвращаем обновленные слайды с сервера, если требуется
    } catch (error) {
      console.error('Ошибка при обновлении порядка слайдов на сервере:', error);
      return rejectWithValue('Ошибка при обновлении порядка слайдов: ' + error.message);
    }
  }
);



export const toggleSlideVisibility = createAsyncThunk(
  'slides/toggleSlideVisibility',
  async ({ id, hidden }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-vacancyDetails/toggle-slide/${id}`, { hidden });
    if (response.status === 200) {
      dispatch(updateSlideVisibility({ id, hidden }));
      dispatch(fetchSlides());
      }
      return response.data;
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
    updateSlideVisibility(state, action) {
      const index = state.slides.findIndex((slide) => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index].hidden = action.payload.hidden;
          state.slides = [...state.slides];
        }
    },
    updateSlidesOrderLocally(state, action) { 
      state.slides = action.payload;
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
        state.slides = [...state.slides, action.payload];
      })
      .addCase(editSlide.fulfilled, (state, action) => {
        const index = state.slides.findIndex(slide => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = {...state.slides[index], ...action.payload};  
        } else {
          console.warn('Slide not found for update, adding new slide.');
          state.slides.push(action.payload);
        }
      })
      .addCase(fetchSlideById.fulfilled, (state, action) => {      
        const existingIndex = state.slides.findIndex((slide) => slide.id === action.payload.id);
        if (existingIndex !== -1) {
          state.slides[existingIndex] = action.payload;
        } else {
          state.slides.push(action.payload);
        }
      })
      .addCase(fetchSlideById.rejected, (state, action) => {   
        console.error('Ошибка при получении данных слайда:', action.payload);
        state.error = action.payload;
      })
      .addCase(updateSlidesOrder.fulfilled, (state, action) => {
        state.slides = action.payload.slides;
      })    
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.slides = state.slides.filter((slide) => slide.id !== action.payload); 
        state.slides = [...state.slides];
      });
  },
});

export const { resetSlidesState, updateSlideVisibility, updateSlidesOrderLocally } = formAddSlideSlice.actions;

export default formAddSlideSlice.reducer;
