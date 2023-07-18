import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;


const articleSlice = createSlice({
  name: "article",
  initialState: {
    article: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchArticleStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticleSuccess(state, action) {
      state.loading = false;
      state.article = action.payload;
      state.error = null;
    },
    fetchArticleFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // deleteArticleSuccess(state, action) {
    //   const articleId = action.payload;
    //   state.article = state.article.filter((el) => el.id !== articleId);
    // },
    // deleteArticleFailure(state, action) {
    //   state.error = action.payload;
    // },
  },
});

export const {
    fetchArticleStart,
    fetchArticleSuccess,
    fetchArticleFailure,
} = articleSlice.actions;



export const getFetchFormArticle = () => async (dispatch) => {
  dispatch(fetchArticleStart());

  try {
    const response = await axios.get(
      `${serverHost}/api-article/getzapros`
    );
   dispatch(fetchArticleSuccess(response.data));
   
  } catch (error) {
    dispatch(fetchArticleFailure(error.message));
  }
};


export default articleSlice.reducer;