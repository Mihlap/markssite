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

// Thunk для получения одной записи
export const fetchJournalById = createAsyncThunk('journal/fetchJournalById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api-journal/getzapros/${id}`);
    if (!response.data) {
      throw new Error('Нет данных для указанного ID');
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке записи:', error);
    return rejectWithValue(error.message || 'Ошибка при загрузке записи');
  }
});

// Thunk для создания маркдаун_файл
export const uploadMarkdownFile = createAsyncThunk('journal/uploadMarkdownFile', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append('markdownFile', file);
    const response = await axios.post(`${serverHost}/api-journal/uploadMarkdownFile`, formData);
    return response.data.url;
  } catch (error) {
    console.error('Ошибка при загрузке Markdown-файла:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk для создания новой записи
export const createJournal = createAsyncThunk('journal/createJournal', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${serverHost}/api-journal/postzapros`, formData, {
      // headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk для обновления записи
export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ journalId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-journal/editzapros/${journalId}`, formData, {
        // headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk для удаления Markdown-файла по URL
export const deleteMarkdownFile = createAsyncThunk('journal/deleteMarkdownFile', async (url, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-journal/delete-file`, {
      data: { url },
    });
    return url;
  } catch (error) {
    console.error('Ошибка при удалении Markdown-файла:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk для удаления записи
export const deleteJournal = createAsyncThunk('journal/deleteJournal', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-journal/deletezapros/${id}`);
    return { id };
  } catch (error) {
    console.error('Ошибка при удалении записи:', error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
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
  },
  reducers: {
    setFormData(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    updateAuthors(state, action) {
      state.formData.authors = action.payload;
    },
    clearFormData(state) {
      state.formData = {
        title: '',
        publication_date: '',
        category: [],
        issue_number: '',
        authors: [],
        attachments: {},
        markdown_content: '',
        imageKey: '',
        blocks: [
          { id: Date.now() + 1, type: 'university', value: '' },
          { id: Date.now() + 2, type: 'location', value: '' },
        ],
      };
    },
    setSelectedIssueNumber(state, action) {
      state.selectedIssueNumber = action.payload;
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
      .addCase(fetchJournalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJournalById.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        const attachmentsById = (data.authors || []).reduce((acc, author, index) => {
          acc[author.id] = author.image || data.attachments?.[index] || null;
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
          attachments: attachmentsById,
          organizations: data.organizations || [],
          locations: data.locations || [],
          markdown_content: data.markdown_content || '',
          imageKey: data.imageKey || '',
          blocks: [
            ...(data.organizations || []).map((org, index) => ({
              id: org.id || `university-${index}`,
              type: 'university',
              value: org.value || org.name || '',
            })),
            ...(data.locations || []).map((loc, index) => ({
              id: loc.id || `location-${index}`,
              type: 'location',
              value: loc.value || loc.name || '',
            })),
          ],
        };
      })
      .addCase(fetchJournalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при загрузке записи';
      })
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = [action.payload.journal, ...state.journals];
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
        state.journals = state.journals.map((journal) => (journal.id === updatedJournal.id ? updatedJournal : journal));
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMarkdownFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMarkdownFile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteMarkdownFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.loading = false;
        state.journals = state.journals.filter((journal) => journal.id !== id);
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, updateAuthors, clearFormData, addTemporaryImage, setSelectedIssueNumber } = journalSlice.actions;

export default journalSlice.reducer;
