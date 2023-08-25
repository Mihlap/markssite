import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const serverHost = process.env.REACT_APP_SERVER_HOST;
      const response = await axios.post(
        `${serverHost}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  "auth/checkUserAuth",
  async (_, { rejectWithValue }) => {
    try {
      const serverHost = process.env.REACT_APP_SERVER_HOST;
      const response = await axios.get(`${serverHost}/api/auth/user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const serverHost = process.env.REACT_APP_SERVER_HOST;
      const response = await axios.get(`${serverHost}/api/auth/logout`, {
        withCredentials: true,
      });
      return response.status;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
     builder
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
