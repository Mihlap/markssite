import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loading: false,
    error: null,
    selectedViewConstruction: "",
    selectedCity: "",
    selectedLocation: "",
  },
  reducers: {
    fetchProjectStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProjectSuccess(state, action) {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProjectSuccess(state, action) {
      const projectId = action.payload;
      state.projects = state.projects.filter((el) => el.id !== projectId);
    },
    deleteProjectFailure(state, action) {
      state.error = action.payload;
    },
    setSelectedViewConstruction(state, action) {
      state.selectedViewConstruction = action.payload;
    },
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    setSelectedLocation(state, action) {
      state.selectedLocation = action.payload;
    },
  },
});

export const {
  fetchProjectStart,
  fetchProjectSuccess,
  fetchProjectFailure,
  deleteProjectSuccess,
  deleteProjectFailure,
  setViewConstruction,
  setSelectedCity,
  setSelectedLocation,
  setSelectedViewConstruction,
} = projectSlice.actions;

export const fetchProject =
  (formattedData, setInputData) => async (dispatch) => {
    dispatch(fetchProjectStart());
    const formData = new FormData();
    for (const key in formattedData) {
      if (typeof formattedData[key] === "object") {
        if (key === "photoAva" && formattedData[key].length > 0) {
          formData.append("photoAva", formattedData[key][0]);
        } else if (key === "imageOpen" && formattedData[key].length > 0) {
          formData.append("imageOpen", formattedData[key][0]);
          // console.log("imageOpen", formattedData[key]);
        } else if (key === "dynamicBlocks" && formattedData[key].length > 0) {
          console.log("зашел сюда", formattedData[key]);

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
                  // Делаем копию объекта и заменяем value на массив имен файлов
                  return {
                    ...obj,
                    value: obj.value.map((file) => (file ? file.name : null)),
                  };
                }
                return obj; // Если это не файл, просто возвращаем исходный объект
              });
            }
          );

          formData.append(
            "dynamicBlocksJSON",
            JSON.stringify(cloneDynamicBlocks)
          );

          // console.log("консоль с trycode", photosArray);
          photosArray.forEach((photo) => {
            formData.append("dynamicImages", photo);
          });
        } else {
          for (const file of formattedData[key]) {
            // console.log("file", file);
            formData.append(key, file);
            //  обрати внимание во сюда, тут в file лежат объекты с фотографиями!
            //  они и есть dropPhoto на бекенде
          }
        }
      } else {
        formData.append(key, formattedData[key]);
      }
    }

    axios.post(`${serverHost}/api-project/postzapros`, formData).then(() => {
      dispatch(getFetchForm());
    });
    console.log(formattedData, "<<<---REDUX");
  };

export const getFetchForm = () => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(`${serverHost}/api-project/getzapros`);

    dispatch(fetchProjectSuccess(response.data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};

export const getFetchFormFilter =
  (page, projectsPerPage, viewConstruction, competency = "") =>
  async (dispatch) => {
    dispatch(fetchProjectStart());
    try {
      const response = await axios.get(
        `${serverHost}/api-project/getzapros-filter?page=${page}&limit=${projectsPerPage}`
      );

      const filteredData = response.data.filter(item => {
        const itemConstructionList = item.viewConstruction.split(',');
        return itemConstructionList.some(construction => viewConstruction.includes(construction.trim()));
      });

      dispatch(fetchProjectSuccess(filteredData));
      console.log(filteredData);
    } catch (error) {
      dispatch(fetchProjectFailure(error.message));
    }
  };;

export const getFetchFormCityFilter =
  (page, projectsPerPage, countryCity) => async (dispatch) => {
    dispatch(fetchProjectStart());

    try {
      const response = await axios.get(
        `${serverHost}/api-project/getzapros?page=${page}&countryCity=${countryCity}&limit=${projectsPerPage}`
      );
      dispatch(fetchProjectSuccess(response.data));
    } catch (error) {
      dispatch(fetchProjectFailure(error.message));
    }
  };

export const getFetchFormLocationFilter =
  (page, projectsPerPage, location, countryCity) => async (dispatch) => {
    dispatch(fetchProjectStart());

    try {
      const response = await axios.get(
        `${serverHost}/api-project/getzapros?page=${page}&countryCity=${countryCity}&location=${location}&limit=${projectsPerPage}`
      );
      dispatch(fetchProjectSuccess(response.data));
    } catch (error) {
      dispatch(fetchProjectFailure(error.message));
    }
  };

export const deleteForm = (id) => async (dispatch) => {
  try {
    await axios.delete(`${serverHost}/api-project/deletezapros/${id}`);
    dispatch(deleteProjectSuccess(id));
  } catch (error) {
    dispatch(deleteProjectFailure(error.message));
  }
};

export default projectSlice.reducer;
