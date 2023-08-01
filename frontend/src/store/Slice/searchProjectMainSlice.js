// searchPublicationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;
const searchProjectMainSlice = createSlice({
  name: "searchproject",
  initialState: {
    projects: [],
    loading: false,
    error: null,
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
    updateProjectOrderSuccess(state, action) {
      state.projects = action.payload;
    },
    deleteProjectSuccess(state, action) {
      const projectId = action.payload;
      state.projects = state.projects.filter(
        (el) => el.IdProject !== projectId
      );
    },
    deleteProjectFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchProjectStart,
  fetchProjectSuccess,
  fetchProjectFailure,
  updateProjectOrderSuccess,
  deleteProjectSuccess,
  deleteProjectFailure,
} = searchProjectMainSlice.actions;

export const searchProgectMainPostzapros =
  (filteredObject, setSearchId) => async (dispatch) => {
    dispatch(fetchProjectStart());
    console.log(filteredObject.id);
    try {
      await axios.post(`${serverHost}/search/search-project`, {
        project: filteredObject,
        IdProject: filteredObject.id,
      });

      // After successfully saving the project, fetch the updated data from the server
      dispatch(getZaprosData());

      setSearchId({
        searchId: "",
      });
    } catch (error) {
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchProjectFailure(error.message));
    }
  };

  export const fetchSingleProject = (projectId) => async (dispatch) => {
    dispatch(fetchProjectStart());
    try {
      const response = await axios.get(`${serverHost}/search/search-project/${projectId}`);
      const singleProject = response.data;
      dispatch(fetchProjectSuccess(singleProject));
    } catch (error) {
      dispatch(fetchProjectFailure(error.message));
    }
  };

export const getZaprosData = () => async (dispatch) => {
  dispatch(fetchProjectStart());
  try {
    const response = await axios.get(
      `${serverHost}/search/search-project/getzapros`
    );
    const dataFromResponse = response.data;
    dispatch(fetchProjectSuccess(dataFromResponse)); 
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};

export const deleteProject = (IdProject) => async (dispatch) => {
  try {
    await axios.delete(
      `${serverHost}/search/search-project/deletezapros/${IdProject}`
    );
    dispatch(deleteProjectSuccess(IdProject));
  } catch (error) {
    dispatch(deleteProjectFailure(error.message));
  }
};


export const updateProjectOrderReplacement =
  (updatedProjects) => async (dispatch) => {
    dispatch(fetchProjectStart());
    try {
      // Send a PUT request to the server with the updated projects array
      const response = await axios.put(
        `${serverHost}/search/search-project-replacement`,
        updatedProjects
      );
      // After the server responds, update the state with the updated projects data
      dispatch(updateProjectOrderSuccess(response.data));
    } catch (error) {
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchProjectFailure(error.message));
    }
  };

export default searchProjectMainSlice.reducer;
