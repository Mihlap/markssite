import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: {
    vacancies: [],
    loading: true,
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
      });
  },
});

export default vacanciesSlice.reducer;
