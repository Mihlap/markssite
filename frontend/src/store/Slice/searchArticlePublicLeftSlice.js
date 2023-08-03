import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;

const searchArticlePublicLeftSlice = createSlice({
  name: "searchArticlePublicLeft",
  initialState: {
    articleLeft: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchArticleLeftStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticleLeftSuccess(state, action) {
      state.loading = false;
      state.articleLeft = action.payload;
    },
    fetchArticleLeftFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteArticleLeftSuccess(state, action) {
      const ArticleId = action.payload;
      state.articleLeft = state.articleLeft.filter((el) => el.id !== ArticleId);
    },
  },
});

export const {
  fetchArticleLeftStart,
  fetchArticleLeftSuccess,
  fetchArticleLeftFailure,
  deleteArticleLeftSuccess,
} = searchArticlePublicLeftSlice.actions;

export const searchArticleLeftMain =
  (filterArticle, setSearcIdOne, setSaveIdOne, setIsBtnDisabledPublicOne) =>
  async (dispatch) => {
    console.log("searchArticleLeftMain function started"); // New console.log
    dispatch(fetchArticleLeftStart());

    try {
      console.log("Starting axios request");
      const response = await axios.post(`${serverHost}/search-article/left`, {
        publication: filterArticle,
        IdArticle: filterArticle.id,
      });
      console.log(response);
      console.log(123);
      dispatch(searchArticleLeftGet());
      setSearcIdOne("");
      setSaveIdOne(null);
      setIsBtnDisabledPublicOne(true);
    } catch (error) {
      console.log("Axios request error");
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchArticleLeftFailure(error.message));
    }
  };



export const searchArticleLeftGet = () => async (dispatch) => {
  dispatch(fetchArticleLeftStart());

  try {
    const response = await axios.get(`${serverHost}/search-article/left-get`);
    const data = response.data;
    dispatch(fetchArticleLeftSuccess(data));
  } catch (error) {
    dispatch(fetchArticleLeftFailure(error.message));
  }
};

export default searchArticlePublicLeftSlice.reducer;
