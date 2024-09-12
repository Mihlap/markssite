import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    article: [],
    loading: false,
    error: null,
    selectedType: 'Все',
    articleId: null,
    formData: {
      dynamicData: [],
    },
  },
  reducers: {
    fetchArticleStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticleSuccess(state, action) {
      state.loading = false;
      state.article = action.payload;
      // state.error = null;
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
    setDynamicData(state, action) {
      state.dynamicData = action.payload;
    },
    deleteArticleFailure(state, action) {
      state.error = action.payload;
    },
    setDynamicImages(state, action) {
      state.dynamicImages = action.payload;
    },
    clearFormData(state) {
      // state.articleId = null;
      state.formData = {
        title: '',
        author: '',
        city: '',
        dataMonthYear: '',
        selectCompetencies: [],
        dropPhoto: [],
        titleTextBlock: '',
        descriptionArticle: '',
        photoAva: '',
        imageOpen: '',
        textBlock: '',
        imageClose: '',
        imageTitle: '',
        imageAuthor: '',
        dynamicData: [],
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
  setDynamicData,
  setDynamicImages,
  clearFormData,
} = articleSlice.actions;

export const fetchArticle = createAsyncThunk('article/fetchArticle', async (formattedData, { dispatch, getState }) => {
  dispatch(fetchArticleStart());

  const formData = new FormData();
  const articleId = getState().article.articleId;

  const requestMethod = articleId ? 'PUT' : 'POST';
  const requestUrl = articleId
    ? `${serverHost}/api-article/editzapros/${articleId}`
    : `${serverHost}/api-article/postzapros`;

  // for (const key in formattedData) {
  //   if (Array.isArray(formattedData[key])) {
  //     if (key === "photoAva" && formattedData[key].length > 0) {
  //       formData.append("photoAva", formattedData[key][0]);
  //     } else if (key === "imageOpen" && formattedData[key].length > 0) {
  //       formData.append("imageOpen", formattedData[key][0]);
  //     } else if (key === "dynamicBlocks" && formattedData[key].length > 0) {
  //       let data = formattedData[key];
  //       let photosArray = [];

  //       data.forEach((outerObj) => {
  //         outerObj.forEach((innerObj) => {
  //           if (
  //             innerObj.type === "file" &&
  //             Array.isArray(innerObj.value) &&
  //             innerObj.value.length > 0
  //           ) {
  //             photosArray = photosArray.concat(innerObj.value);
  //           }
  //         });
  //       });
  for (const key in formattedData) {
    if (formattedData.hasOwnProperty(key)) {
      const value = formattedData[key];

      if (value !== null && typeof value === 'object') {
        if (key === 'photoAva' && value?.length > 0) {
          formData.append('photoAva', value[0]);
        } else if (key === 'imageOpen' && value?.length > 0) {
          formData.append('imageOpen', value[0]);
        } else if (key === 'dynamicBlocks' && value?.length > 0) {
          let photosArray = [];

          value.forEach((outerObj) => {
            outerObj.forEach((innerObj) => {
              // console.log("Inner object:", innerObj);
              if (innerObj.type === 'file' && Array.isArray(innerObj.value) && innerObj.value.length > 0) {
                // console.log("Files to add:", innerObj.value);
                photosArray = photosArray.concat(innerObj.value);
              }
            });
          });

          // const cloneDynamicBlocks = formattedData.dynamicBlocks.map(
          //   (outerArray) => {
          //     return outerArray.map((obj) => {
          //       if (obj.type === "file" && Array.isArray(obj.value)) {
          //         return {
          //           ...obj,
          //           value: obj.value.map((file) =>
          //             file ? file.name : null
          //           ),
          //         };
          //       }
          //       return obj;
          //     });
          //   }
          // );
          const cloneDynamicBlocks = value.map((outerArray) => {
            return outerArray.map((obj) => {
              // Проверяем, что значение value не равно undefined и не пустой массив
              if (obj.type === 'file' && Array.isArray(obj.value) && obj.value.length > 0) {
                // Обработка значений типа file
                const processedFiles = obj.value.map((file) => {
                  // Проверяем, что файл не равен undefined и не null
                  if (file && typeof file === 'object') {
                    // Если это объект, возвращаем его имя
                    return file.name;
                  } else {
                    // Если это уже имя файла, возвращаем его без изменений
                    return file;
                  }
                });

                // Возвращаем обновленный объект с обработанными значениями value
                return {
                  ...obj,
                  value: processedFiles,
                };
              }
              // Возвращаем объект без изменений, если тип не file или значение value пустой массив или undefined
              return obj;
            });
          });

          //       formData.append(
          //         "dynamicBlocksJSON",
          //         JSON.stringify(cloneDynamicBlocks)
          //       );

          //       photosArray.forEach((photo) => {
          //         formData.append("dynamicImages", photo);
          //       });
          //     } else {
          //       for (const file of formattedData[key]) {
          //         formData.append(key, file);
          //       }
          //     }
          //   } else {
          //     formData.append(key, formattedData[key]);
          //   }
          // }
          formData.append('dynamicBlocksJSON', JSON.stringify(cloneDynamicBlocks));
          // console.log(cloneDynamicBlocks, '<----cloneDynamicBlocks');

          photosArray.forEach((photo) => {
            formData.append('dynamicImages', photo);
          });
        } else {
          for (const file of value) {
            formData.append(key, file);
          }
        }
      } else {
        formData.append(key, value);
      }
    }
  }
  try {
    await axios({
      method: requestMethod,
      url: requestUrl,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(clearFormData());
    dispatch(getFetchFormArticle());
    if (articleId) {
      dispatch(getDynamicData(articleId));
    }
    dispatch(setArticleId(null));
  } catch (error) {
    console.error('Error while fetching or processing article:', error);
    dispatch(fetchArticleFailure(error.response?.data?.message || error.message));
  }
});

export const getDynamicData = (articleId) => async (dispatch) => {
  dispatch(fetchArticleStart());

  try {
    const response = await axios.get(`${serverHost}/api-article/getdynamicdata/${articleId}`);
    dispatch(setDynamicData(response.data.dynamicData));
    dispatch(setDynamicImages(response.data.dynamicImages));
  } catch (error) {
    dispatch(fetchArticleFailure(error.message));
  }
};

export const getFetchFormArticle = () => async (dispatch, getState) => {
  dispatch(fetchArticleStart());
  const selectedType = getState().article.selectedType;

  try {
    const response = await axios.get(`${serverHost}/api-article/getzapros`);
    let filteredArticles = response.data;

    if (selectedType !== 'Все') {
      const selectedTypes = selectedType.split(',');
      filteredArticles = filteredArticles.filter((article) =>
        selectedTypes.some((type) => article.selectCompetencies.includes(type.trim()))
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
