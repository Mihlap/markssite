import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;

const articleSlice = createSlice({
  name: "article",
  initialState: {
    article: [],
    loading: false,
    error: null,
    selectedType: "Все",
    articleId: null,
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
    setSelectedType(state, action) {
      state.selectedType = action.payload;
    },
    setArticleId(state, action) {
      state.articleId = action.payload;
    },
    deleteArticleSuccess(state, action) {
      const articleId = action.payload;
      state.article = state.article.filter((el) => el.id !== articleId);
    },
    deleteArticleFailure(state, action) {
      state.error = action.payload;
    },
    clearFormData(state) {
      state.articleId = null;
      state.article = {
        title: "",
        author: "",
        city: "",
        dataMonthYear: "",
        selectCompetencies: [],
        dropPhoto: [],
        titleTextBlock: "",
        descriptionArticle: "",
        photoAva: "",
        imageOpen: "",
        textBlock: "",
        imageClose: "",
        imageTitle: "",
      };
    },
  },
});
export const {
  fetchArticleStart,
  fetchArticleSuccess,
  fetchArticleFailure,
  setSelectedType,
  setArticleId,
  deleteArticleSuccess,
  deleteArticleFailure,
  clearFormData,
} = articleSlice.actions;

export const fetchArticle = createAsyncThunk(
  "article/fetchArticle",
  async (formattedData, { dispatch, getState }) => {
    dispatch(fetchArticleStart());

    const formData = new FormData();
    const articleId = getState().article.articleId;

    const requestMethod = articleId ? "PUT" : "POST";
    const requestUrl = articleId
      ? `${serverHost}/api-article/editzapros/${articleId}`
      : `${serverHost}/api-article/postzapros`;

    try {
      for (const key in formattedData) {
        if (Array.isArray(formattedData[key])) {
          if (key === "photoAva" && formattedData[key].length > 0) {
            formData.append("photoAva", formattedData[key][0]);
          } else if (key === "imageOpen" && formattedData[key].length > 0) {
            formData.append("imageOpen", formattedData[key][0]);
          } else if (key === "dynamicBlocks" && formattedData[key].length > 0) {
            let data = formattedData[key];
            let photosArray = [];

            data.forEach((outerObj) => {
              outerObj.forEach((innerObj) => {
                if (
                  innerObj.type === "file" &&
                  Array.isArray(innerObj.value) &&
                  innerObj.value.length > 0
                ) {
                  photosArray = photosArray.concat(innerObj.value);
                }
              });
            });

            const cloneDynamicBlocks = formattedData.dynamicBlocks.map(
              (outerArray) => {
                return outerArray.map((obj) => {
                  if (obj.type === "file" && Array.isArray(obj.value)) {
                    return {
                      ...obj,
                      value: obj.value.map((file) =>
                        file ? file.name : null
                      ),
                    };
                  }
                  return obj;
                });
              }
            );

            formData.append(
              "dynamicBlocksJSON",
              JSON.stringify(cloneDynamicBlocks)
            );

            photosArray.forEach((photo) => {
              formData.append("dynamicImages", photo);
            });
          } else {
            for (const file of formattedData[key]) {
              formData.append(key, file);
            }
          }
        } else {
          formData.append(key, formattedData[key]);
        }
      }

      const response = await axios({
        method: requestMethod,
        url: requestUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await dispatch(getFetchFormArticle());
    } catch (error) {
      console.error("Error while fetching or processing article:", error);
      dispatch(fetchArticleFailure(error.response?.data?.message || error.message));
    }
  }
);


// export const fetchArticle =
//   (
//     formattedData,
//     setInputData,
//     setPreviewPhotos,
//     setPreviewPhotoAva,
//     setPreviewPhotoOpen,
//     setPreviewPhotoClose
//   ) =>
//   async (dispatch) => {
//     dispatch(fetchArticleStart());
//     // console.log(formattedData, "<<---");
//     const formData = new FormData();
//         for (const key in formattedData) {
//           if (typeof formattedData[key] === "object") {
//             if (key === "photoAva" && formattedData[key].length > 0) {
//               formData.append("photoAva", formattedData[key][0]);
//             } else if (key === "imageOpen" && formattedData[key].length > 0) {
//               formData.append("imageOpen", formattedData[key][0]);
//               // console.log("imageOpen", formattedData[key]);
//             } else if (
//               key === "dynamicBlocks" &&
//               formattedData[key].length > 0
//             ) {
//               // console.log("зашел сюда", formattedData[key]);

//               let data = formattedData[key];

//               let photosArray = [];

//               data.forEach((outerObj) => {
//                 outerObj.forEach((innerObj) => {
//                   if (
//                     innerObj.type === "file" &&
//                     Array.isArray(innerObj.value) &&
//                     innerObj.value.length > 0
//                   ) {
//                     photosArray = photosArray.concat(innerObj.value);
//                   }
//                 });
//               });

//               const cloneDynamicBlocks = formattedData.dynamicBlocks.map(
//                 (outerArray) => {
//                   return outerArray.map((obj) => {
//                     if (obj.type === "file" && Array.isArray(obj.value)) {
//                       // Делаем копию объекта и заменяем value на массив имен файлов
//                       return {
//                         ...obj,
//                         value: obj.value.map((file) =>
//                           file ? file.name : null
//                         ),
//                       };
//                     }
//                     return obj; // Если это не файл, просто возвращаем исходный объект
//                   });
//                 }
//               );

//               formData.append(
//                 "dynamicBlocksJSON",
//                 JSON.stringify(cloneDynamicBlocks)
//               );

//               // console.log("консоль с trycode", photosArray);
//               photosArray.forEach((photo) => {
//                 formData.append("dynamicImages", photo);
//               });
//             } else {
//               for (const file of formattedData[key]) {
//                 // console.log("file", file);
//                 formData.append(key, file);
//                 //  обрати внимание во сюда, тут в file лежат объекты с фотографиями!
//                 //  они и есть dropPhoto на бекенде
//               }
//             }
//           } else {
//             formData.append(key, formattedData[key]);
//           }
//         }

//     axios.post(`${serverHost}/api-article/postzapros`, formData).then(() => {
//       setInputData({
//         title: "",
//         author: "",
//         city: "",
//         dataMonthYear: "",
//         selectCompetencies: "",
//         dropPhoto: [],
//         titleTextBlock: "",
//         descriptionArticle: "",
//         photoAva: [],
//         imageOpen: [],
//         textBlock: "",
//         imageClose: [],
//       });
//       setPreviewPhotos([]);
//       setPreviewPhotoAva([]);
//       setPreviewPhotoOpen([]);
//       setPreviewPhotoClose([]);
//       dispatch(getFetchFormArticle()); // Добавлен этот вызов для получения обновленных данных после успешной отправки формы
//     });
//     // console.log(formattedData, "<<<---REDUX ARTICLES");
//   };

export const getFetchFormArticle = () => async (dispatch, getState) => {
  dispatch(fetchArticleStart());
  const selectedType = getState().article.selectedType;

  try {
    const response = await axios.get(`${serverHost}/api-article/getzapros`);
    let filteredArticles = response.data;

    if (selectedType !== "Все") {
      const selectedTypes = selectedType.split(",");
      filteredArticles = filteredArticles.filter((article) =>
        selectedTypes.some((type) =>
          article.selectCompetencies.includes(type.trim())
        )
      );
    }

    dispatch(fetchArticleSuccess(filteredArticles));
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
