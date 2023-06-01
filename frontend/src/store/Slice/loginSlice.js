import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    identifier: "",
    password: "",
    user: null,
    error: null,
    isLoading: false,
  },
  reducers: {
    setIdentifier: (state, action) => {
      state.identifier = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setIdentifier,
  setPassword,
  loginStart,
  loginSuccess,
  loginFailure,
} = loginSlice.actions;

export const login = () => async (dispatch, getState) => {
  dispatch(loginStart());

  const { identifier, password } = getState().login;

  try {
    const response = await axios.post("http://localhost:1337/api/auth/local", {
      identifier,
      password,
    });

    dispatch(loginSuccess(response.data.user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export default loginSlice.reducer;
