import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const serverHost = process.env.REACT_APP_SERVER_HOST;
    const response = await axios.post(`${serverHost}/api/auth/login`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Login failed');
  }
});

export const checkUserAuth = createAsyncThunk('auth/checkUserAuth', async (_, { rejectWithValue }) => {
  try {
    const serverHost = process.env.REACT_APP_SERVER_HOST;
    const response = await axios.get(`${serverHost}/api/auth/user`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Unauthorized');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const serverHost = process.env.REACT_APP_SERVER_HOST;
    const response = await axios.get(`${serverHost}/api/auth/logout`, { withCredentials: true });
    return response.status;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Logout failed');
  }
});

export const getAllUserNames = createAsyncThunk('auth/getAllUserNames', async (_, { rejectWithValue }) => {
  try {
    const serverHost = process.env.REACT_APP_SERVER_HOST;
    const response = await axios.get(`${serverHost}/api/auth/allUsers`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Load users failed');
  }
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const serverHost = process.env.REACT_APP_SERVER_HOST;
    const res = await axios.delete(`${serverHost}/api/auth/user/${userId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || 'Delete failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userNames: [],
    error: null,
    status: 'idle',
    deleteStatus: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAllUserNames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUserNames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userNames = action.payload;
        state.error = null;
      })
      .addCase(getAllUserNames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load users';
      })
      .addCase(deleteUser.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const deletedId = action.payload?.id;
        if (deletedId != null) {
          state.userNames = state.userNames.filter((u) => String(u.id) !== String(deletedId));
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload ?? 'Failed to delete user';
      });
  },
});

export default authSlice.reducer;
