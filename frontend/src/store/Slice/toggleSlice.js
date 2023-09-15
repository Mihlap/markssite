// feature/toggle/toggleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;


export const updateToggleStateAsync = createAsyncThunk(
  "toggle/updateState",
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

export const fetchToggleStateAsync = createAsyncThunk(
  "toggle/fetchState",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api/toggle/project`);
      return response.data.isActiveForButton1;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Добавляем новое действие для второй кнопки
export const updateToggleStateForButton2Async = createAsyncThunk(
  "toggle/updateStateForButton2",
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
  "toggle/fetchStateForButton2",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverHost}/api/toggle/article`);
      return response.data.isActiveForButton2;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    isActiveForButton1: false,
    isActiveForButton2: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [updateToggleStateAsync.pending]: (state, action) => {
      console.log("Starting API request to update toggle");
    },
    [updateToggleStateAsync.fulfilled]: (state, action) => {
      state.isActiveForButton1 = !state.isActiveForButton1;
      console.log("Successfully updated toggle in state");
    },
    [updateToggleStateAsync.rejected]: (state, action) => {
      state.error = action.payload?.message || "An unknown error occurred";
      console.error("Error updating toggle:", state.error);
    },
    [fetchToggleStateAsync.fulfilled]: (state, action) => {
      state.isActiveForButton1 = action.payload;
      console.log("Successfully fetched toggle state from server");
    },
    [fetchToggleStateAsync.rejected]: (state, action) => {
      if (action.payload && action.payload.message) {
        state.error = action.payload?.message;
        console.error("Error fetching toggle state:", action.payload.message);
      } else {
        state.error = "Unknown error occurred.";
        console.error("Unknown error occurred during toggle state fetch.");
      }
    },
    [updateToggleStateForButton2Async.pending]: (state, action) => {
      console.log("Starting API request to update toggle for button 2");
    },
    [updateToggleStateForButton2Async.fulfilled]: (state, action) => {
      state.isActiveForButton2 = !state.isActiveForButton2;
      console.log("Successfully updated toggle for button 2 in state");
    },
    [updateToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || "An unknown error occurred";
      console.error(
        "Error updating toggle for button 2:",
        action.payload?.message
      );
    },
    [fetchToggleStateForButton2Async.fulfilled]: (state, action) => {
      state.isActiveForButton2 = action.payload;
      console.log("Successfully fetched toggle state for button 2 from server");
    },
    [fetchToggleStateForButton2Async.rejected]: (state, action) => {
      state.error = action.payload?.message || "An unknown error occurred";
      console.error(
        "Error fetching toggle state for button 2:",
        action.payload?.message
      );
    },
  },
});



export default toggleSlice.reducer;
