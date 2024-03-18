import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const fetchVacancies = createAsyncThunk(
  'vacancies/fetchVacancies',
  async () => {
    try {
      const response = await fetch("https://api.hh.ru/vacancies?employer_id=1098613");
      if (response.ok) {
        const data = await response.json();
        return data.items;
      } else {
        throw new Error("Failed to fetch vacancies");
      }
    } catch (error) {
      throw new Error(`Error fetching vacancies: ${error}`);
    }
  }
);


const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: {
    vacancies: [],
    loading: false,
    error: null,
    formData: {
    title: "",
    textBlock1: "",
    textBlock2: "",
    textBlock3: "",
    direction: "",
    experience: "",
    location: "",
    busyness: "",
    workMode: "",
    skills: [],
    benefits: [],
    },
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
    deleteVacancySuccess(state, action) {
      const vacanciesId = action.payload;
      state.vacancies = state.vacancies.filter((el) => el.id !== vacanciesId);
    },
    deleteVacancyFailure(state, action) {
      state.error = action.payload;
    },
    setVacancyId(state, action) {
      state.vacanciesId = action.payload;
    },
    clearFormData(state) {
      state.formData = {
        title: "",
        textBlock1: "",
        textBlock2: "",
        textBlock3: "",
        direction: "",
        experience: "",
        location: "",
        busyness: "",
        workMode: "",
        skills: [],
        benefits: [],
      };
    },
  },
  extraReducers: {
    [fetchVacancies.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchVacancies.fulfilled]: (state, action) => {
      state.loading = false;
      state.vacancies = action.payload;
    },
    [fetchVacancies.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const {
  fetchVacancyStart,
  fetchVacancySuccess,
  fetchVacancyFailure,
  deleteVacancySuccess,
  deleteVacancyFailure,
  setVacancyId,
  clearFormData, 
} = vacanciesSlice.actions;


export const addVacancy = createAsyncThunk(
  'vacancies/addVacancy',
  async (formData, { dispatch, getState }) => {
    dispatch(fetchVacancyStart());
    const benefitsValue = Array.isArray(formData.benefits) ? formData.benefits.join(", ") : formData.benefits;
    const skillsValue = Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills;
    
    try {
      const response = await axios.post(`${serverHost}/api-vacancy/addVacancy`, { ...formData, skills: skillsValue, benefits: benefitsValue });
      
      dispatch(clearFormData());
      dispatch(getFetchForm());
      
      return response.data;
    } catch (error) {
      console.error("Ошибка при добавлении вакансии:", error);
      dispatch(fetchVacancyFailure(error.message));
    
    }
  }
);

export const getFetchForm = () => async (dispatch) => {
  dispatch(fetchVacancyStart());

  try {
    const response = await axios.get(`${serverHost}/api-vacancy/getzapros`);

    dispatch(fetchVacancySuccess(response.data));
  } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};

export const deleteForm = (id) => async (dispatch, getState) => {
  try {
    await axios.delete(`${serverHost}/api-vacancy/deletezapros/${id}`);
    
    const updatedVacancies = getState().vacancies.vacancies.filter((el) => el.id !== id);
    dispatch(fetchVacancySuccess(updatedVacancies));
  } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};

export default vacanciesSlice.reducer;
