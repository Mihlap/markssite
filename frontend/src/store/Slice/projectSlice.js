import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { getImageUrls } from "../../Project/utils";

const serverHost = process.env.REACT_APP_SERVER_HOST;

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loading: false,
    error: null,
    selectedViewConstruction: "",
    selectedCity: '',
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
  setSelectedViewConstruction,
  setSelectedCity,
  setSelectedLocation,
} = projectSlice.actions;

export const fetchProject = (formattedData, setInputData) => async (dispatch) => {
  dispatch(fetchProjectStart());
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

  
  axios.post(`${serverHost}/api-project/postzapros`, formData).then(() => {
    setInputData({
      title: "",
      photoAva: [],
      // selectCompetencies: "",
      // countryCity: "",
      // monthYear: "",
      // viewConstruction: "",
      // dropPhoto: [],
      // titleTextBlock: "",
      // descriptionProject: "",
      // totalArea: "",
      // siteArea: "",
      // floors: "",
      // altitude: "",
      // constructionVolume: "",
      // location: "",
      // degreeParticipation: "",
      // statusObject: "",
      // customer: "",
      // publication: "",
      // linkToPublication: "",
      // publicationTwo: "",
      // linkToPublicationTwo: "",
      // awards: "",
      // imageOpen: [],
      // textBlock: "",
    });
    dispatch(getFetchForm()); // Добавлен этот вызов для получения обновленных данных после успешной отправки формы
    });
  console.log(formattedData, "REDUX");
};

export const getFetchForm = () => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(
      `${serverHost}/api-project/getzapros`
    );
    // const projectsWithImageUrls = response.data.map((project) => ({
    //   ...project,
    //   imageUrls: getImageUrls(project.imageTitle),
    // }));
   dispatch(fetchProjectSuccess(response.data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};

export const getFetchFormFilter = (page, projectsPerPage, viewConstruction) => async (dispatch) => {
  dispatch(fetchProjectStart());

  try {
    const response = await axios.get(
      `${serverHost}/api-project/getzapros-filter?page=${page}&viewConstruction=${viewConstruction}&limit=${projectsPerPage}`
    );
   dispatch(fetchProjectSuccess(response.data));
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};

export const getFetchFormCityFilter = (page, projectsPerPage, countryCity) => async (dispatch) => {
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

export const getFetchFormLocationFilter = (page, projectsPerPage, location, countryCity) => async (dispatch) => {
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