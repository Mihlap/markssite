import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const HOST = (process.env.REACT_APP_SERVER_HOST || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const api = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const API_BASE = '/api/legend';

const pickLegendBlocks = (it) => {
  if (Array.isArray(it?.dynamicBlocks) && it.dynamicBlocks.length) return it.dynamicBlocks;
  if (Array.isArray(it?.ConstructorLegends) && it.ConstructorLegends.length) {
    return it.ConstructorLegends.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter((arr) => arr.length);
  }
  return [];
};

const normalizeLegendItem = (it) => ({
  ...it,
  hidden: !!it.hidden,
  order: typeof it.order === 'number' ? it.order : 0,
  dynamicBlocks: pickLegendBlocks(it),
  previewText: it.previewText || it.description || '',
  previewImageUrl: it.previewImageUrl || it.previewImageUrl === '' ? it.previewImageUrl : it.img || '',
  avatarUrl: it.avatarUrl || it.avatarUrl === '' ? it.avatarUrl : it.avatar || '',
});

export const uploadHistoryMarkdownFile = createAsyncThunk(
  'companyHistory/uploadHistoryMarkdownFile',
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append('markdownFile', file);
      const { data } = await api.post(`${API_BASE}/upload-markdown-file`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteHistoryMarkdownFile = createAsyncThunk(
  'companyHistory/deleteHistoryMarkdownFile',
  async (url, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE}/delete-markdown-file`, { data: { url } });
      return url;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const fetchCompanyHistory = createAsyncThunk('companyHistory/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`${API_BASE}`);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const createHistoryItem = createAsyncThunk('companyHistory/create', async (payload, { rejectWithValue }) => {
  try {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      const { data } = await api.post(`${API_BASE}/mp`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const body = {
      year: Number(payload.year),
      title: String(payload.title || '').trim(),
      description: String(payload.description || '').trim(),
      img: payload.img ? String(payload.img).trim() : null,
      hidden: !!payload.hidden,
      constructor: payload.constructor || null,
    };
    const { data } = await api.post(`${API_BASE}`, body);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const updateHistoryItem = createAsyncThunk(
  'companyHistory/update',
  async ({ id, data: body }, { rejectWithValue }) => {
    try {
      if (typeof FormData !== 'undefined' && body instanceof FormData) {
        const { data } = await api.put(`${API_BASE}/mp/${id}`, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }
      const payload = {
        year: body.year ?? undefined,
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        img: body.img ?? undefined,
        hidden: body.hidden ?? undefined,
        constructor: body.constructor ?? undefined,
      };
      const { data } = await api.put(`${API_BASE}/${id}`, payload);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteHistoryItem = createAsyncThunk('companyHistory/delete', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`${API_BASE}/${id}`);
    return data?.id ?? id;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const toggleHistoryVisibility = createAsyncThunk(
  'companyHistory/toggleVisibility',
  async ({ id, hidden }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`${API_BASE}/${id}/hidden`, { hidden });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateHistoryOrder = createAsyncThunk(
  'companyHistory/updateOrder',
  async (items, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`${API_BASE}/order/bulk`, items);
      return data || items;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const companyHistorySlice = createSlice({
  name: 'companyHistory',
  initialState,
  reducers: {
    updateHistoryOrderLocally(state, action) {
      state.items = (action.payload || []).map(normalizeLegendItem);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload || []).map(normalizeLegendItem);
      })
      .addCase(fetchCompanyHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Ошибка загрузки истории';
      })

      .addCase(createHistoryItem.pending, (state) => {
        state.error = null;
      })
      .addCase(createHistoryItem.fulfilled, (state, action) => {
        const item = normalizeLegendItem(action.payload);
        state.items.push(item);
      })
      .addCase(createHistoryItem.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Ошибка создания записи';
      })

      .addCase(updateHistoryItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateHistoryItem.fulfilled, (state, action) => {
        const updated = normalizeLegendItem(action.payload);
        state.items = state.items.map((x) => (x.id === updated.id ? updated : x));
      })
      .addCase(updateHistoryItem.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Ошибка обновления записи';
      })

      .addCase(deleteHistoryItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((x) => x.id !== id);
      })
      .addCase(deleteHistoryItem.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Ошибка удаления записи';
      })

      .addCase(toggleHistoryVisibility.pending, (state, action) => {
        const { id, hidden } = action.meta.arg || {};
        if (id == null) return;
        state.items = state.items.map((it) =>
          it.id === id ? { ...it, hidden: typeof hidden === 'boolean' ? hidden : !it.hidden } : it
        );
      })
      .addCase(toggleHistoryVisibility.fulfilled, (state, action) => {
        const updated = normalizeLegendItem(action.payload);
        state.items = state.items.map((it) => (it.id === updated.id ? updated : it));
      })
      .addCase(toggleHistoryVisibility.rejected, (state, action) => {
        const { id } = action.meta.arg || {};
        if (id != null) {
          state.items = state.items.map((it) => (it.id === id ? { ...it, hidden: !it.hidden } : it));
        }
        state.error = action.payload || action.error?.message || 'Ошибка переключения видимости';
      })

      .addCase(updateHistoryOrder.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload) && payload.length && typeof payload[0] === 'object') {
          state.items = payload.map(normalizeLegendItem);
        } else if (Array.isArray(action.meta.arg)) {
          const map = new Map(action.meta.arg.map(({ id, order }) => [id, order]));
          state.items = state.items
            .map((it) => (map.has(it.id) ? { ...it, order: map.get(it.id) } : it))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (b.year ?? 0) - (a.year ?? 0));
        }
      })
      .addCase(updateHistoryOrder.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || 'Ошибка сохранения порядка';
      });
  },
});

export const { updateHistoryOrderLocally } = companyHistorySlice.actions;
export default companyHistorySlice.reducer;
