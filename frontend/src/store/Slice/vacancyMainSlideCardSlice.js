import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const postVacancyData = createAsyncThunk(
  'slides/postVacancyData',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${serverHost}/api-vacancyDetails/save-vacancy-details`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const slide = res?.data?.data;
      if (!slide) throw new Error('Некорректный ответ сервера: отсутствует поле data');
      dispatch(fetchSlides());
      return slide;
    } catch (error) {
      const msg = error.response?.data || error.message;
      console.error('Ошибка при отправке данных на сервер:', msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchSlides = createAsyncThunk('slides/fetchSlides', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${serverHost}/api-vacancyDetails/get-slides`);
    return res.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных: ' + error.message);
  }
});

export const fetchSlideDetails = createAsyncThunk('slides/fetchSlideDetails', async (slideId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${serverHost}/api-vacancyDetails/get-slide/${slideId}`);
    return res.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных слайда: ' + error.message);
  }
});

export const fetchSlideById = createAsyncThunk('slides/fetchSlideById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${serverHost}/api-vacancyDetails/get-slide/${id}`);
    return res.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных слайда: ' + error.message);
  }
});

export const editSlide = createAsyncThunk('slides/editSlide', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${serverHost}/api-vacancyDetails/update-slide/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.status !== 200) return rejectWithValue('Не удалось обновить слайд');
    const slide = res?.data?.data;
    if (!slide) throw new Error('Некорректный ответ сервера: отсутствует поле data');
    return slide;
  } catch (error) {
    return rejectWithValue('Ошибка при обновлении слайда: ' + error.message);
  }
});

export const updateSlidesOrder = createAsyncThunk(
  'vacancyMainSlideCard/updateSlidesOrder',
  async (slides, { rejectWithValue }) => {
    try {
      const payload = slides
        .map((slide, index) => ({ id: slide.id ?? slide.data?.id, order: index }))
        .filter((s) => s.id != null);

      const res = await axios.put(`${serverHost}/api-vacancyDetails/update-slides-order`, { slides: payload });
      return res.data;
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
      const res = await axios.put(`${serverHost}/api-vacancyDetails/toggle-slide/${id}`, { hidden });
      if (res.status === 200) {
        dispatch(updateSlideVisibility({ id, hidden }));
      }
      return res.data;
    } catch (error) {
      console.error('Ошибка при переключении видимости слайда:', error);
      return rejectWithValue('Ошибка при переключении видимости слайда: ' + error.message);
    }
  }
);

export const deleteSlide = createAsyncThunk(
  'slides/deleteSlide',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete(`${serverHost}/api-vacancyDetails/delete-slide/${id}`);
      const state = getState();
      const slides = (state.formAddSlide?.slides || [])
        .filter((s) => s.id !== id)
        .sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return (a.id ?? 0) - (b.id ?? 0);
        });

      const reindexed = slides.map((s, i) => ({ ...s, order: i }));
      dispatch(updateSlidesOrderLocally(reindexed));
      try {
        await dispatch(updateSlidesOrder(reindexed)).unwrap();
      } catch (e) {
        console.warn('Не удалось сохранить новый порядок после удаления:', e);
      }

      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении слайда: ' + (error?.message || 'unknown'));
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
        state.slides[index] = { ...state.slides[index], hidden: action.payload.hidden };
        state.slides = [...state.slides];
      }
    },
    updateSlidesOrderLocally(state, action) {
      state.slides = [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlides.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSlides.fulfilled, (state, action) => {
        const arr = Array.isArray(action.payload) ? action.payload : [];
        state.slides = [...arr].sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return (a.id ?? 0) - (b.id ?? 0);
        });
        state.isLoading = false;
      })
      .addCase(fetchSlides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchSlideDetails.fulfilled, (state, action) => {
        const slide = action.payload;
        const i = state.slides.findIndex((s) => s.id === slide.id);
        if (i !== -1) state.slides[i] = slide;
        else state.slides.push(slide);
        state.slides = [...state.slides];
      })
      .addCase(fetchSlideDetails.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(postVacancyData.fulfilled, (state, action) => {
        state.slides = [...state.slides, action.payload];
      })
      .addCase(editSlide.fulfilled, (state, action) => {
        const slide = action.payload;
        const index = state.slides.findIndex((s) => s.id === slide.id);
        if (index !== -1) {
          state.slides[index] = slide;
        } else {
          state.slides.push(slide);
        }
        state.slides = [...state.slides];
      })
      .addCase(editSlide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchSlideById.fulfilled, (state, action) => {
        const slide = action.payload;
        const i = state.slides.findIndex((s) => s.id === slide.id);
        if (i !== -1) state.slides[i] = slide;
        else state.slides.push(slide);
        state.slides = [...state.slides];
      })
      .addCase(fetchSlideById.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateSlidesOrder.fulfilled, (state, action) => {
        const arr = action.payload?.slides || [];
        state.slides = [...arr].sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return (a.id ?? 0) - (b.id ?? 0);
        });
      })
      .addCase(updateSlidesOrder.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.slides = state.slides.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSlide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetSlidesState, updateSlideVisibility, updateSlidesOrderLocally } = formAddSlideSlice.actions;
export default formAddSlideSlice.reducer;
