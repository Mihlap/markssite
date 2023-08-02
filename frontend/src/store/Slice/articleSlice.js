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
    deleteArticleSuccess(state, action) {
      const articleId = action.payload;
      state.article = state.article.filter((el) => el.id !== articleId);
    },
    deleteArticleFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchArticleStart,
  fetchArticleSuccess,
  fetchArticleFailure,
  deleteArticleSuccess,
  deleteArticleFailure,
} = articleSlice.actions;



export const fetchArticle =
  (
    formattedData,
    setInputData,
    setPreviewPhotos,
    setPreviewPhotoAva,
    setPreviewPhotoOpen,
    setPreviewPhotoClose
  ) =>
  async (dispatch) => {
    dispatch(fetchArticleStart());
    const formData = new FormData();
    for (const key in formattedData) {
      if (typeof formattedData[key] === "object") {
        if (key === "photoAva" && formattedData[key].length > 0) {
          formData.append("photoAva", formattedData[key][0]);
        } else if (key === "imageOpen" && formattedData[key].length > 0) {
          formData.append("imageOpen", formattedData[key][0]);
        } else {
          for (const file of formattedData[key]) {
            formData.append(key, file);
          }
        }
      } else {
        formData.append(key, formattedData[key]);
      }
    }

    axios.post(`${serverHost}/api-article/postzapros`, formData).then(() => {
      setInputData({
        title: "",
        author: "",
        city: "",
        dataMonthYear: "",
        dropPhoto: [],
        titleTextBlock: "",
        descriptionArticle: "",
        photoAva: [],
        imageOpen: [],
        textBlock: "",
        imageClose: [],
      });
      setPreviewPhotos([]);
      setPreviewPhotoAva([]);
      setPreviewPhotoOpen([]);
      setPreviewPhotoClose([]);
      dispatch(getFetchFormArticle()); // Добавлен этот вызов для получения обновленных данных после успешной отправки формы
    });
    // console.log(formattedData, "REDUX");
  };

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


export const deleteFormArticle = (id) => async (dispatch) => {
  try {
    await axios.delete(`${serverHost}/api-article/deletezapros/${id}`);
    dispatch(deleteArticleSuccess(id));
  } catch (error) {
    dispatch(deleteArticleFailure(error.message));
  }
};


export default articleSlice.reducer;