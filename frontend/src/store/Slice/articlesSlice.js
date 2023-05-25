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
    fetchArticlesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticlesSuccess(state, action) {
      state.loading = false;
      state.articles = action.payload;
    },
    fetchArticlesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
} = articlesSlice.actions;

export const fetchArticles = () => async (dispatch) => {
  dispatch(fetchArticlesStart());

  try {
    const response = await axios.get("http://localhost:1337/api/articles");
    dispatch(fetchArticlesSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchArticlesFailure(error.message));
  }
};

export default articlesSlice.reducer;
