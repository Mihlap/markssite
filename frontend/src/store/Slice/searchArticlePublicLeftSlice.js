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
      console.log("deleteArticleLeftSuccess called");
      const ArticleId = action.payload;
      state.articleLeft = state.articleLeft.filter((el) => el.id !== ArticleId);
    },
    deleteArticleLeftFailure(state, action) {
      state.error = action.payload;
    },
    updateArticleLeftSuccess(state, action) {
      const updatedArticle = action.payload;
      state.articleLeft = state.articleLeft.map((article) =>
        article.id === updatedArticle.id ? updatedArticle : article
      );
    },
  },
});

export const {
  fetchArticleLeftStart,
  fetchArticleLeftSuccess,
  fetchArticleLeftFailure,
  deleteArticleLeftSuccess,
  deleteArticleLeftFailure,
  updateArticleLeftSuccess,
} = searchArticlePublicLeftSlice.actions;

export const getUpdatedArticles = () => async (dispatch) => {
  dispatch(fetchArticleLeftStart());

  try {
    const response = await axios.get(`${serverHost}/search-article/left-get`);
    const data = response.data;
    console.log(data);
    dispatch(fetchArticleLeftSuccess(data));
  } catch (error) {
    dispatch(fetchArticleLeftFailure(error.message));
  }
};

export const searchArticleLeftMain =
  (filterArticle, setSearcIdOne, setSaveIdOne, setIsBtnDisabledPublicOne) =>
  async (dispatch) => {
    dispatch(fetchArticleLeftStart());
    try {
       await axios.post(`${serverHost}/search-article/left`, {
        publication: filterArticle,
        IdArticle: filterArticle.id,
      });
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

export const searchArticleLeftDelete = (IdArticle) => async (dispatch) => {
  dispatch(fetchArticleLeftStart());

  try {
    const response = await axios.delete(
      `${serverHost}/search-article/left-delete/${IdArticle}`
    );
    console.log(response.status); // Check the response status
    dispatch(deleteArticleLeftSuccess(IdArticle));
  } catch (error) {
    dispatch(deleteArticleLeftFailure(error.message));
  }
};

export const updateArticleLeft = (filterArticle) => async (dispatch) => {
  console.log("updateArticleLeft called:", filterArticle); // Add this line for debugging

  dispatch(fetchArticleLeftStart());

  try {
    const response = await axios.post(
      `${serverHost}/search-article/left-update`,{
        publication: filterArticle,
        IdArticle: filterArticle.id,
      });
    const updatedArticle = response.data;
    console.log("Response from the server:", updatedArticle); // Add this line for debugging
    dispatch(updateArticleLeftSuccess(updatedArticle));
    dispatch(searchArticleLeftGet());
  } catch (error) {
    console.error("Error updating the article:", error);
  }
};



export default searchArticlePublicLeftSlice.reducer;
