import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchArtickesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArtickesSuccess(state, action) {
      state.loading = false;
      state.articles = action.payload;
    },
    fetchArtickesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchArtickesStart,
  fetchArtickesSuccess,
  fetchArtickesFailure,
} = articlesSlice.actions;

export const fetchArtickes = () => async (dispatch) => {
  dispatch(fetchArtickesStart());

  try {
    const response = await axios.get("http://localhost:1337/api/articles");
    dispatch(fetchArtickesSuccess(response.data));
  } catch (error) {
    dispatch(fetchArtickesFailure(error.message));
  }
};

export default articlesSlice.reducer;
