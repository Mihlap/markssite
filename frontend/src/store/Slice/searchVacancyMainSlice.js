// searchPublicationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverHost = process.env.REACT_APP_SERVER_HOST;
const searchVacancyMainSlice = createSlice({
  name: "searchvacancy",
  initialState: {
    vacancies: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchVacancyStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchVacancySuccess(state, action) { 
      state.loading = false;
      state.vacancies = action.payload;
    },
    fetchVacancyFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },   
    updateVacancyOrderSuccess(state, action) {
      state.vacancies = action.payload;
    },
    deleteVacancySuccess(state, action) {
      const vacancyId = action.payload;
      state.vacancies = state.vacancies.filter(
        (el) => el.IdVacancy !== vacancyId
      );
    },
    deleteVacancyFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchVacancyStart,
  fetchVacancySuccess,
  fetchVacancyFailure,
  updateVacancyOrderSuccess,
  deleteVacancySuccess,
  deleteVacancyFailure,
} = searchVacancyMainSlice.actions;

export const searchVacancyMainPostzapros =
  (filteredObject, setSearchId) => async (dispatch) => { 
    dispatch(fetchVacancyStart());
    try {
      await axios.post(`${serverHost}/search/search-vacancy`, {
        vacancy: filteredObject,
        IdVacancy: filteredObject.id,
      });
      dispatch(getZaprosData());
      setSearchId({
        searchId: "",
      });
    } catch (error) {
      console.error("Ошибка при отправке на бекенд:", error.response?.data || error.message);
      dispatch(fetchVacancyFailure(error.response?.data || error.message));
    }
  };

  export const fetchSingleVacancy = (vacancyId) => async (dispatch) => {
    dispatch(fetchVacancyStart());
    try {
      const response = await axios.get(`${serverHost}/search/search-vacancy/${vacancyId}`);
      const singleVacancy = response.data;
      dispatch(fetchVacancySuccess(singleVacancy));
    } catch (error) {
      dispatch(fetchVacancyFailure(error.message));
    }
  };

export const getZaprosData = () => async (dispatch) => {
  dispatch(fetchVacancyStart());
  try {
    const response = await axios.get(
      `${serverHost}/search/search-vacancy/getzapros`
    );
    const dataFromResponse = response.data;
    dispatch(fetchVacancySuccess(dataFromResponse)); 
  } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};


export const deleteVacancy = (IdVacancy) => async (dispatch) => {
  try {
    await axios.delete(
      `${serverHost}/search/search-vacancy/deletezapros/${IdVacancy}`
    );
    dispatch(deleteVacancySuccess(IdVacancy));
  } catch (error) {
    dispatch(deleteVacancyFailure(error.message));
  }
};


export const updateVacancyOrderReplacement =
  (updatedVacancies) => async (dispatch) => {
    dispatch(fetchVacancyStart());
    try {
      const response = await axios.put(
        `${serverHost}/search/search-vacancy-replacement`,
        updatedVacancies
      );
      dispatch(updateVacancyOrderSuccess(response.data));
    } catch (error) {
      console.error("Ошибка при отправке на бекенд:", error);
      dispatch(fetchVacancyFailure(error.message));
    }
  };

export default searchVacancyMainSlice.reducer;
