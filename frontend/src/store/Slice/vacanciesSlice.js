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
    hidden: [],
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
    type: "",
    hidden: "",
  },
  selectedFilter: "Все",
  vacancyCountsByDirection: {},
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
    setSelectedFilter(state, action) {
      state.selectedFilter = action.payload;
    }, 
    setVacancyCountsByDirection(state, action) {
      state.vacancyCountsByDirection = { ...state.vacancyCountsByDirection, ...action.payload };
    },
    updateVacancyLookStatusAndSaveToDB(state, action) {
      const { id, hidden } = action.payload;
      const index = state.hidden.findIndex(item => item.id === id);
      if (Array.isArray(hidden)) { 
        if (index !== -1) {
          state.hidden[index] = { id, hidden };
        } else {
          state.hidden.push({ id, hidden });
        }
      }
    },
    
    updateVacancyLookStatusSuccess(state, action) {
      state.hidden = action.payload;
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
        type: "",
        hidden: [],
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
  setSelectedFilter,
  setVacancyCountsByDirection,
  clearFormData, 
  updateVacancyLookStatus,
  updateVacancyLookStatusSuccess,
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

export const sendCopiedVacancyToServer = (copiedVacancy) => {
  return async (dispatch) => {
    try {
      // Отправляем скопированную вакансию на сервер
      const response = await axios.post(`${serverHost}/api-vacancy/copyVacancy/${copiedVacancy.id}`, copiedVacancy);

      // Вызовите другие действия Redux, если необходимо
      dispatch(clearFormData());
      dispatch(getFetchForm());
    
      return response;
    } catch (error) {
      console.error('Ошибка при отправке скопированной вакансии на сервер:', error);
      dispatch(fetchVacancyFailure(error.message));
    }
  };
};


export const editVacancy = createAsyncThunk(
  'vacancies/editVacancy',
  async ({ id, formData }, { dispatch, getState }) => {
    dispatch(fetchVacancyStart());

    const directionValue = Array.isArray(formData.direction) ? formData.direction.join(", ") : formData.direction;
    const experienceValue = Array.isArray(formData.experience) ? formData.experience.join(", ") : formData.experience;
    const locationValue = Array.isArray(formData.location) ? formData.location.join(", ") : formData.location;
    const busynessValue = Array.isArray(formData.busyness) ? formData.busyness.join(", ") : formData.busyness;
    const workModeValue = Array.isArray(formData.workMode) ? formData.workMode.join(", ") : formData.workMode;
    const benefitsValue = Array.isArray(formData.benefits) ? formData.benefits.join(", ") : formData.benefits;
    const skillsValue = Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills;
    const hiddenValue = formData.hidden;

    try {
   
      const response = await axios.put(`${serverHost}/api-vacancy/editVacancy/${id}`, {
        ...formData,
        direction: directionValue,
        experience: experienceValue,
        location: locationValue,
        busyness: busynessValue,
        workMode: workModeValue,
        skills: skillsValue,
        benefits: benefitsValue,
        hidden: hiddenValue,
      });

      dispatch(clearFormData());
      dispatch(getFetchForm());

      return response.data;
    } catch (error) {
      console.error("Error editing vacancy:", error);
      dispatch(fetchVacancyFailure(error.message));
      throw error; 
    }
  }
);

export const updateVacancyLookStatusAndSaveToDB = createAsyncThunk(
  'vacancies/updateVacancyLookStatusAndSaveToDB',
  async ({ id, hidden }) => {
    try {
      // Отправляем запрос на сервер для обновления данных в БД
      const response = await axios.put(`${serverHost}/api-vacancy/updateVacancyLookStatus/${id}`, { hidden });
      
      // Возвращаем данные, полученные от сервера
      return response.data;
    } catch (error) {
      console.error("Error updating vacancy look status:", error);
      throw error;
    }
  }
);



// Добавляем новое действие для извлечения информации о скрытых вакансиях из базы данных
export const getFetchForm = (hidden) => async (dispatch) => {
  dispatch(fetchVacancyStart());

  try {
 
    // Запрос на получение информации о скрытых вакансиях
    const response = await axios.get(`${serverHost}/api-vacancy/getzapros`)  

    // Обновляем состояние в Redux с полученными данными
    dispatch(fetchVacancySuccess(response.data));
   } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};

export const getHiddenVacanciesFromDB = () => async (dispatch) => {
  dispatch(fetchVacancyStart());

  try {
    // Отправляем запрос на получение скрытых вакансий из базы данных
    const response = await axios.get(`${serverHost}/api-vacancy/getHiddenVacancies`);
  
    // Обновляем состояние в Redux с полученными скрытыми вакансиями
    dispatch(updateVacancyLookStatusSuccess(response.data)); // Обновляем состояние скрытых вакансий
  } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};



export const getFetchFormFilter = (direction) => async (dispatch, getState) => {
  dispatch(fetchVacancyStart());

  try {
    const response = await axios.get(`${serverHost}/api-vacancy/getzapros-filter`, {
      params: {
        direction,    
      },
    });
    dispatch(fetchVacancySuccess(response.data)); 
  
  } catch (error) {
    dispatch(fetchVacancyFailure(error.message));
  }
};

export const getVacanciesByDirection = () => async (dispatch) => {
  try {
    const response = await axios.get(`${serverHost}/api-vacancy/getzapros`);
    const vacancies = response.data;
    
    // Создаем объект для хранения количества вакансий по направлениям
    const counts = {};

    // Проходим по каждой вакансии и считаем их по направлениям
    vacancies.forEach((vacancy) => {
      const { direction } = vacancy;
      counts[direction] = counts[direction] ? counts[direction] + 1 : 1;
    });

    // Обновляем состояние в Redux Store с полученными данными
    dispatch(setVacancyCountsByDirection(counts));
  } catch (error) {
    console.error("Error fetching vacancies count by direction:", error);
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
