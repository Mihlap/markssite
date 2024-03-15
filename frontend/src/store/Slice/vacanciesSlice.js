import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const serverHost = process.env.REACT_APP_SERVER_HOST;


const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: {
    vacancies: [],
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
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchVacancies.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchVacancies.fulfilled, (state, action) => {
      state.loading = false;
      state.vacancies = action.payload;
    })
    .addCase(fetchVacancies.rejected, (state) => {
      state.loading = false;
    })
    .addCase(addVacancy.pending, (state) => {
      state.loading = true;
    })
    .addCase(addVacancy.fulfilled, (state, action) => {
      state.loading = false;
      state.formData = {
        ...state.formData,
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
    })
    .addCase(addVacancy.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const fetchVacancies = createAsyncThunk('vacancies/fetchVacancies', async () => {
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
});

export const addVacancy = createAsyncThunk(
  'vacancies/addVacancy',
  async (formData, thunkAPI) => {
    try {
         // Преобразуем значение benefits, skills в строку, если это массив
         const benefitsValue = Array.isArray(formData.benefits) ? formData.benefits.join(", ") : formData.benefits;
         const skillsValue = Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills;
                  
         // Отправляем POST-запрос на сервер для добавления вакансии
         const response = await axios.post(`${serverHost}/api-vacancy/addVacancy`, { ...formData,skills: skillsValue, benefits: benefitsValue});
         
         // Возвращаем данные о вакансии в случае успешного добавления
      return response.data;
    } catch (error) {
      // Возвращаем ошибку в случае неудачного добавления вакансии
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export default vacanciesSlice.reducer;
