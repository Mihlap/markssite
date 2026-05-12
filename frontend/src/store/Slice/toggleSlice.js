import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

// === project toggle (button1)
export const updateToggleStateAsync = createAsyncThunk(
  'toggle/updateState',
  async (isActiveForButton1, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/project`, { isActiveForButton1 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

export const fetchToggleStateAsync = createAsyncThunk('toggle/fetchState', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api/toggle/project`);
    return response.data.isActiveForButton1;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
  }
});

// === article toggle (button2)
export const updateToggleStateForButton2Async = createAsyncThunk(
  'toggle/updateStateForButton2',
  async (isActiveForButton2, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/article`, { isActiveForButton2 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
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
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

// === registration route toggle (button3)
export const updateToggleStateForButton3Async = createAsyncThunk(
  'toggle/updateStateForButton3',
  async (isActiveForButton3, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/button3`, { isActiveForButton3 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
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
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

// === journal toggle (button4)
export const updateToggleStateForButton4Async = createAsyncThunk(
  'toggle/updateStateForButton4',
  async (isActiveForButton4, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api/toggle/journal`, { isActiveForButton4 });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
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
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

// === staff categories (категории сотрудников)
const DEFAULT_STAFF_CATS = { leadership: true, science: true, hr: true };

export const fetchStaffCategoryTogglesAsync = createAsyncThunk(
  'toggle/fetchStaffCats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${serverHost}/api/toggle/staff-categories`);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: 'Unknown error' });
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
      return rejectWithValue(e?.response?.data || { message: 'Unknown error' });
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
    staffCats: { ...DEFAULT_STAFF_CATS },
    error: null,
  },
  reducers: {},
  extraReducers: {
    // button1
    [updateToggleStateAsync.pending]: (state) => {},
    [updateToggleStateAsync.fulfilled]: (state) => {
      state.isActiveForButton1 = !state.isActiveForButton1;
    },
    [updateToggleStateAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateAsync.fulfilled]: (state, action) => {
      state.isActiveForButton1 = !!action.payload;
    },
    [fetchToggleStateAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error occurred.';
    },

    // button2
    [updateToggleStateForButton2Async.pending]: (state) => {},
    [updateToggleStateForButton2Async.fulfilled]: (state) => {
      state.isActiveForButton2 = !state.isActiveForButton2;
    },
    [updateToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateForButton2Async.fulfilled]: (state, action) => {
      state.isActiveForButton2 = !!action.payload;
    },
    [fetchToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },

    // button3
    [updateToggleStateForButton3Async.pending]: (state) => {},
    [updateToggleStateForButton3Async.fulfilled]: (state) => {
      state.isActiveForButton3 = !state.isActiveForButton3;
    },
    [updateToggleStateForButton3Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error occurred';
    },
    [fetchToggleStateForButton3Async.fulfilled]: (state, action) => {
      state.isActiveForButton3 = !!action.payload;
    },
    [fetchToggleStateForButton3Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error occurred';
    },

    // button4
    [updateToggleStateForButton4Async.pending]: (state) => {},
    [updateToggleStateForButton4Async.fulfilled]: (state) => {
      state.isActiveForButton4 = !state.isActiveForButton4;
    },
    [updateToggleStateForButton4Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },
    [fetchToggleStateForButton4Async.fulfilled]: (state, action) => {
      state.isActiveForButton4 = !!action.payload;
    },
    [fetchToggleStateForButton4Async.rejected]: (state, action) => {
      state.error = action.payload?.message || 'An unknown error occurred';
    },

    // staffCats
    [fetchStaffCategoryTogglesAsync.fulfilled]: (state, action) => {
      const p = action.payload || {};
        state.staffCats = {
        leadership: p.leadership === undefined ? true : !!p.leadership,
        science: p.science === undefined ? true : !!p.science,
        hr: p.hr === undefined ? true : !!p.hr,
      };
    },
    [fetchStaffCategoryTogglesAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Unknown error';   
      state.staffCats = { ...DEFAULT_STAFF_CATS };
    },
    [updateStaffCategoryToggleAsync.fulfilled]: (state, action) => {
      const key = action.payload?.key ?? action.meta?.arg?.key;
      const value = action.payload?.value ?? action.meta?.arg?.value;
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
