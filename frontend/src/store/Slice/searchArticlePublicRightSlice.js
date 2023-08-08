import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;

const searchArticlePublicRightSlice = createSlice({
  name: "searchArticlePublicRight",
  initialState: {
    articleRight: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchArticleRightStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticleRightSuccess(state, action) {
      state.loading = false;
      state.articleRight = action.payload;
    },
    fetchArticleRightFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteArticleRightSuccess(state, action) {
      const ArticleId = action.payload;
      state.articleRight = state.articleRight.filter(
        (el) => el.id !== ArticleId
      );
    },
    deleteArticleRightFailure(state, action) {
      state.error = action.payload;
    },
    updateArticleRightSuccess(state, action) {
      const updatedArticle = action.payload;
      state.articleRight = state.articleRight.map((article) =>
        article.id === updatedArticle.id ? updatedArticle : article
      );
    },
  },
});

export const {
  fetchArticleRightStart,
  fetchArticleRightSuccess,
  fetchArticleRightFailure,
  deleteArticleRightSuccess,
  deleteArticleRightFailure,
  updateArticleRightSuccess,
} = searchArticlePublicRightSlice.actions;

export const getUpdatedArticles = () => async (dispatch) => {
  dispatch(fetchArticleRightStart());

  try {
    const response = await axios.get(`${serverHost}/search-articles/right-get`);
    const data = response.data;
    console.log(data);
    dispatch(fetchArticleRightSuccess(data));
  } catch (error) {
    dispatch(fetchArticleRightFailure(error.message));
  }
};

export const searchArticleRightMain =
  (filterArticle, setSearcIdTwo, setSaveIdTwo, setIsBtnDisabledPublicTwo) =>
  async (dispatch) => {
    dispatch(fetchArticleRightStart());
    try {
      await axios.post(`${serverHost}/search-articles/right`, {
        publication: filterArticle,
        IdArticle: filterArticle.id,
      });
      dispatch(searchArticleRightGet());
      setSearcIdTwo("");
      setSaveIdTwo(null);
      setIsBtnDisabledPublicTwo(true);
    } catch (error) {
      console.log("Axios request error");
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchArticleRightFailure(error.message));
    }
  };

export const searchArticleRightGet = () => async (dispatch) => {
  dispatch(fetchArticleRightStart());

  try {
    const response = await axios.get(
      `${serverHost}/search-articles/right-get`
    );
      const data = response.data;
      console.log(data);
    dispatch(fetchArticleRightSuccess(data));
  } catch (error) {
    dispatch(fetchArticleRightFailure(error.message));
  }
};

export const searchArticleRightDelete = (IdArticle) => async (dispatch) => {
  dispatch(fetchArticleRightStart());

  try {
    const response = await axios.delete(
      `${serverHost}/search-articles/right-delete/${IdArticle}`
    );
    console.log(response.status); // Check the response status
    dispatch(deleteArticleRightSuccess(IdArticle));
  } catch (error) {
    dispatch(deleteArticleRightFailure(error.message));
  }
};

export const updateArticleRight =
  (filterArticle, setSaveIdOne, setSearcIdOne, setIsBtnDisabledPublicOne) =>
  async (dispatch) => {
    console.log("updateArticleLeft called:", filterArticle); // Add this line for debugging

    dispatch(fetchArticleRightStart());

    try {
      const response = await axios.put(
        `${serverHost}/search-articles/right-update`,
        {
          publication: filterArticle,
          IdArticle: filterArticle.id,
        }
      );
      const updatedArticle = response.data;
      console.log("Response from the server:", updatedArticle); // Add this line for debugging
      dispatch(updateArticleRightSuccess(updatedArticle));
      setSearcIdOne("");
      setSaveIdOne(null);
      setIsBtnDisabledPublicOne(true);
      dispatch(searchArticleRightGet());
    } catch (error) {
      console.error("Error updating the article:", error);
    }
  };

export default searchArticlePublicRightSlice.reducer;
