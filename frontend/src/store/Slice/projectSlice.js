import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
    formData: {
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
      dropPhoto: [],
      photoAva: "",
      titleTextBlock: "",
      descriptionProject: "",
      totalArea: "",
      siteArea: "",
      floors: "",
      altitude: "",
      constructionVolume: "",
      location: "",
      degreeParticipation: "",
      statusObject: "",
      customer: "",
      publication: "",
      linkToPublication: "",
      publicationTwo: "",
      linkToPublicationTwo: "",
      awards: "",
      imageOpen: "",
      headingTextBlock: "",
      textBlock: "",
      imageClose: "",
      // projectId: "",
    },
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
    setProjectId(state, action) {
      state.projectId = action.payload;
    },
    setDynamicData(state, action) {
      state.dynamicData = action.payload;
    },
    setDynamicImages(state, action) {
      state.dynamicImages = action.payload;
    },
    clearFormData(state) {
      state.formData = {
        title: "",
        selectCompetencies: "",
        countryCity: "",
        monthYear: "",
        viewConstruction: "",
        dropPhoto: [],
        photoAva: "",
        titleTextBlock: "",
        descriptionProject: "",
        totalArea: "",
        siteArea: "",
        floors: "",
        altitude: "",
        constructionVolume: "",
        location: "",
        degreeParticipation: "",
        statusObject: "",
        customer: "",
        publication: "",
        linkToPublication: "",
        publicationTwo: "",
        linkToPublicationTwo: "",
        awards: "",
        imageOpen: "",
        headingTextBlock: "",
        textBlock: "",
        imageClose: "",
      };
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
  setProjectId,
  setDynamicData,
  setDynamicImages,
  clearFormData,
} = projectSlice.actions;

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (formattedData, { dispatch, getState }) => {
  dispatch(fetchProjectStart());
  const formData = new FormData();
  const projectId = getState().project.projectId;

  // Используйте PUT запрос, если у вас есть projectId
  const requestMethod = projectId ? "PUT" : "POST";
  const requestUrl = projectId
    ? `${serverHost}/api-project/updatezapros/${projectId}`
    : `${serverHost}/api-project/postzapros`;

  for (const key in formattedData) {
    if (formattedData.hasOwnProperty(key)) {
      const value = formattedData[key];

      if (value !== null && typeof value === "object") {
        if (key === "photoAva" && value?.length > 0) {
          formData.append("photoAva", value[0]);
        } else if (key === "imageOpen" && value?.length > 0) {
          formData.append("imageOpen", value[0]);
        } else if (key === "dynamicBlocks" && value?.length > 0) {
          let photosArray = [];

          value.forEach((outerObj) => {
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

          const cloneDynamicBlocks = value.map((outerArray) => {
            return outerArray.map((obj) => {
              if (obj.type === "file" && Array.isArray(obj.value)) {
                return {
                  ...obj,
                  value: obj.value.map((file) => (file ? file.name : null)),
                };
              }
              return obj;
            });
          });

          formData.append("dynamicBlocksJSON", JSON.stringify(cloneDynamicBlocks));

          photosArray.forEach((photo) => {
            formData.append("dynamicImages", photo);
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
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(clearFormData());
    // Опционально: обновить список проектов
    dispatch(getFetchForm());
   // Опционально: получение динамических данных
   if (projectId) {
    dispatch(getDynamicData(projectId));
  }
  } catch (error) {
    console.error("Ошибка при отправке проекта:", error);
    dispatch(fetchProjectFailure(error.message));
  }
}
);

export const getDynamicData = (projectId) => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(`${serverHost}/api-project/getdynamicdata/${projectId}`);
    dispatch(setDynamicData(response.data.dynamicData));
    dispatch(setDynamicImages(response.data.dynamicImages));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
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
        return viewConstruction.includes("Все") || itemConstructionList.some(construction => viewConstruction.includes(construction.trim()));
      });
  
      dispatch(fetchProjectSuccess(filteredData));
      
    } catch (error) {
      dispatch(fetchProjectFailure(error.message));
    }
  };

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
