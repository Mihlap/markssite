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
  },
});

export const { fetchProjectStart, fetchProjectSuccess, fetchProjectFailure } =
  searchProjectMainSlice.actions;

export const searchProgectMainPostzapros =
  (filteredObject, setSearchId) => async (dispatch) => {
    dispatch(fetchProjectStart());
    try {
      await axios.post(
        `${serverHost}/search/search-project`,
        { project: filteredObject } 
      );

      setSearchId({
        searchId: '',
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
export default searchProjectMainSlice.reducer;
