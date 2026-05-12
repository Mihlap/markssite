import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

// Thunk для получения всех записей
export const fetchJournals = createAsyncThunk('journal/fetchJournals', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${serverHost}/api-journal/getzapros`);
    return data;
  } catch (err) {
    console.error('Ошибка при загрузке журналов:', err);
    return rejectWithValue(err.message);
  }
});

// Thunk для получения одной записи
export const fetchJournalById = createAsyncThunk('journal/fetchJournalById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${serverHost}/api-journal/getzapros/${id}`);
    if (!data) throw new Error('Нет данных для указанного ID');
    return data;
  } catch (err) {
    console.error('Ошибка при загрузке записи:', err);
    return rejectWithValue(err.message || 'Ошибка при загрузке записи');
  }
});

// Thunk для загрузки Markdown-файла
export const uploadMarkdownFile = createAsyncThunk('journal/uploadMarkdownFile', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('markdownFile', file);
    const { data } = await axios.post(`${serverHost}/api-journal/uploadMarkdownFile`, formData);
    return data.url;
  } catch (err) {
    console.error('Ошибка при загрузке Markdown-файла:', err);
    return rejectWithValue(err.message);
  }
});

// Thunk для создания новой записи
export const createJournal = createAsyncThunk('journal/createJournal', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${serverHost}/api-journal/postzapros`, formData);
    return data;
  } catch (err) {
    console.error('Ошибка при создании записи:', err);
    return rejectWithValue(err.message);
  }
});

// Thunk для обновления записи
export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ journalId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${serverHost}/api-journal/editzapros/${journalId}`, formData);
      return data;
    } catch (err) {
      console.error('Ошибка при обновлении записи:', err);
      return rejectWithValue(err.message);
    }
  }
);

// Thunk для удаления Markdown-файла по URL
export const deleteMarkdownFile = createAsyncThunk('journal/deleteMarkdownFile', async (url, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-journal/delete-file`, { data: { url } });
    return url;
  } catch (err) {
    console.error('Ошибка при удалении Markdown-файла:', err);
    return rejectWithValue(err.message);
  }
});

// Thunk для удаления записи
export const deleteJournal = createAsyncThunk('journal/deleteJournal', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-journal/deletezapros/${id}`);
    return { id };
  } catch (err) {
    console.error('Ошибка при удалении записи:', err);
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  formData: {
    title: '',
    publication_date: '',
    category: '',
    issue_number: '',
    authors: [],
    attachments: {},
    organizations: [],
    locations: [],
    markdown_content: '',
    imageKey: '',
    blocks: [
      { id: Date.now() + 1, type: 'university', value: '' },
      { id: Date.now() + 2, type: 'location', value: '' },
    ],
  },
  journals: [],
  loading: false,
  error: null,
  selectedIssueNumber: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setFormData(state, { payload: { name, value } }) {
      state.formData[name] = value;
    },
    updateAuthors(state, { payload }) {
      state.formData.authors = payload;
    },
    clearFormData(state) {
      state.formData = { ...initialState.formData };
    },
    setSelectedIssueNumber(state, { payload }) {
      state.selectedIssueNumber = payload;
    },
  },
  extraReducers: (builder) => {
    builder   
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.journals = payload;
      })
      .addCase(fetchJournals.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })   
      .addCase(fetchJournalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJournalById.fulfilled, (state, { payload: data }) => {
        state.loading = false;    
        const attachmentsById = (data.authors || []).reduce((acc, a, idx) => {
          acc[a.id] = a.image || data.attachments?.[idx] || null;
          return acc;
        }, {});
        state.formData.attachments = attachmentsById;
        state.formData = {
          ...state.formData,
          title: data.title || '',
          publication_date: data.publication_date || '',
          category: Array.isArray(data.category) ? data.category : [],
          issue_number: data.issue_number?.toString() || '',
          authors: Array.isArray(data.authors) ? data.authors : [],
          organizations: data.organizations || [],
          locations: data.locations || [],
          markdown_content: data.markdown_content || '',
          imageKey: data.imageKey || '',
          blocks: [
            ...(data.organizations || []).map((org, i) => ({
              id: org.id || `university-${i}`,
              type: 'university',
              value: org.value || org.name || '',
            })),
            ...(data.locations || []).map((loc, i) => ({
              id: loc.id || `location-${i}`,
              type: 'location',
              value: loc.value || loc.name || '',
            })),
          ],
        };
      })
      .addCase(fetchJournalById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || 'Ошибка при загрузке записи';
      })    
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.journals.unshift(payload.journal);
      })
      .addCase(createJournal.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, { payload }) => {
        state.loading = false;
        const updated = payload.journal;
        state.journals = state.journals.map((j) => (j.id === updated.id ? updated : j));
      })
      .addCase(updateJournal.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })  
      .addCase(deleteMarkdownFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMarkdownFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMarkdownFile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })   
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.journals = state.journals.filter((j) => j.id !== payload.id);
      })
      .addCase(deleteJournal.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setFormData, updateAuthors, clearFormData, setSelectedIssueNumber } = journalSlice.actions;

export default journalSlice.reducer;
