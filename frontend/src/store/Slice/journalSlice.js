import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

// Thunk для получения всех записей
export const fetchJournals = createAsyncThunk('journal/fetchJournals', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api-journal/getzapros`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке журналов:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk для создания новой записи
export const createJournal = createAsyncThunk(
  'journal/createJournal',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${serverHost}/api-journal/postzapros`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      return rejectWithValue(error.message);
    }
  }
);


// Thunk для обновления записи
export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ journalId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-journal/editzapros/${journalId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk для удаления записи
export const deleteJournal = createAsyncThunk('journal/deleteJournal', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-journal/deletezapros/${id}`);
    return id;
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    return rejectWithValue(error.message);
  }
});

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    journals: [],
    formData: {
      title: '',
      publication_date: '',
      category: '',
      issue_number: '',
      authors: [],
      organizations: [],
      locations: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateAuthors(state, action) {
      state.formData.authors = action.payload;
    },
    clearFormData(state) {
      state.formData = {
        title: '',
        publication_date: '',
        category: '',
        issue_number: '',
        authors: [],
        organizations: [],
        locations: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals.push(action.payload.journal);
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJournal = action.payload.journal;
        state.journals = state.journals.map((journal) =>
          journal.id === updatedJournal.id ? updatedJournal : journal
        );
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = state.journals.filter((journal) => journal.id !== action.payload);
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, updateAuthors, clearFormData } = journalSlice.actions;

export default journalSlice.reducer;
