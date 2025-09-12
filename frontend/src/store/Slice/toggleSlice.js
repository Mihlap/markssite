import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const updateToggleStateAsync = createAsyncThunk(
  'toggle/updateState',
  async (isActiveForButton1, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/project`, {
        isActiveForButton1,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchToggleStateAsync = createAsyncThunk('toggle/fetchState', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api/toggle/project`);
    return response.data.isActiveForButton1;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Добавляем новое действие для второй кнопки
export const updateToggleStateForButton2Async = createAsyncThunk(
  'toggle/updateStateForButton2',
  async (isActiveForButton2, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/article`, {
        isActiveForButton2,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchToggleStateForButton2Async = createAsyncThunk(
  'toggle/fetchStateForButton2',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api/toggle/article`);
      return response.data.isActiveForButton2;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// это отвечает за открытие и закрытия роута который даёт возможность зарегистрировать нового пользователя

export const updateToggleStateForButton3Async = createAsyncThunk(
  'toggle/updateStateForButton3',
  async (isActiveForButton3, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/button3`, {
        isActiveForButton3,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Unknown error occurred');
    }
  }
);

export const fetchToggleStateForButton3Async = createAsyncThunk(
  'toggle/fetchStateForButton3',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api/toggle/button3`);
      return response.data.isActiveForButton3;
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Unknown error occurred');
    }
  }
);

export const updateToggleStateForButton4Async = createAsyncThunk(
  'toggle/updateStateForButton4',
  async (isActiveForButton4, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/journal`, {
        isActiveForButton4,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchToggleStateForButton4Async = createAsyncThunk(
  'toggle/fetchStateForButton4',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api/toggle/journal`);
      return response.data.isActiveForButton4;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchStaffCategoryTogglesAsync = createAsyncThunk(
  'toggle/fetchStaffCats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${serverHost}/api/toggle/staff-categories`);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || 'Unknown error');
    }
  }
);

export const updateStaffCategoryToggleAsync = createAsyncThunk(
  'toggle/updateStaffCat',
  async ({ key, value }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${serverHost}/api/toggle/staff-categories`, { key, value });
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || 'Unknown error');
    }
  }
);

const toggleSlice = createSlice({
  name: 'toggle',
  initialState: {
    isActiveForButton1: false,
    isActiveForButton2: false,
    isActiveForButton3: false,
    isActiveForButton4: false,
    staffCats: { leadership: false, science: false, hr: false },
    error: null,
  },
  reducers: {},
  extraReducers: {
    [updateToggleStateAsync.pending]: (state, action) => {},
    [updateToggleStateAsync.fulfilled]: (state, action) => {
      state.isActiveForButton1 = !state.isActiveForButton1;
    },
    [updateToggleStateAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateAsync.fulfilled]: (state, action) => {
      state.isActiveForButton1 = action.payload;
    },
    [fetchToggleStateAsync.rejected]: (state, action) => {
      if (action.payload && action.payload.message) {
        state.error = action.payload?.message;
      } else {
        state.error = 'Unknown error occurred.';
      }
    },
    [updateToggleStateForButton2Async.pending]: (state, action) => {},
    [updateToggleStateForButton2Async.fulfilled]: (state, action) => {
      state.isActiveForButton2 = !state.isActiveForButton2;
    },
    [updateToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateForButton2Async.fulfilled]: (state, action) => {
      state.isActiveForButton2 = action.payload;
    },
    [fetchToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
      console.error('Error fetching toggle state for button 2:', action.payload?.message);
    },
    [updateToggleStateForButton3Async.pending]: (state, action) => {},
    [updateToggleStateForButton3Async.fulfilled]: (state, action) => {
      state.isActiveForButton3 = !state.isActiveForButton3;
    },
    [updateToggleStateForButton3Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error occurred';
    },
    [fetchToggleStateForButton3Async.fulfilled]: (state, action) => {
      state.isActiveForButton3 = action.payload;
    },
    [fetchToggleStateForButton3Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error occurred';
    },
    [updateToggleStateForButton4Async.pending]: (state, action) => {},
    [updateToggleStateForButton4Async.fulfilled]: (state, action) => {
      state.isActiveForButton4 = !state.isActiveForButton4;
    },
    [updateToggleStateForButton4Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateForButton4Async.fulfilled]: (state, action) => {
      state.isActiveForButton4 = action.payload;
    },
    [fetchToggleStateForButton4Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchStaffCategoryTogglesAsync.fulfilled]: (state, action) => {
      const p = action.payload || {};
      state.staffCats = {
        leadership: !!p.leadership,
        science: !!p.science,
        hr: !!p.hr,
      };
    },
    [fetchStaffCategoryTogglesAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error';
    },
    [updateStaffCategoryToggleAsync.fulfilled]: (state, action) => {
      const { key, value } = action.payload || {};
      if (key && key in state.staffCats) {
        state.staffCats[key] = !!value;
      }
    },
    [updateStaffCategoryToggleAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error';
    },
  },
});

export default toggleSlice.reducer;
