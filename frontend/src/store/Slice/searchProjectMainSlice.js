// searchPublicationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;
const searchProjectMainSlice = createSlice({
  name: "search",
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
        { project: filteredObject } // Оборачиваем filteredObject в объект
      );

      setSearchId({
        searchId: '',
      });
    } catch (error) {
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchProjectFailure(error.message));
    }
  };

export const getZaprosData = () => async (dispatch) => {
  dispatch(fetchProjectStart());
  try {
    const response = await axios.get(
      `${serverHost}/search/search-project/getzapros`
    );
    dispatch(fetchProjectSuccess(response.data)); // Dispatch success action with the fetched data
  } catch (error) {
    dispatch(fetchProjectFailure(error.message));
  }
};
export default searchProjectMainSlice.reducer;
