import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const HOST = (process.env.REACT_APP_SERVER_HOST || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const api = axios.create({
  baseURL: `${HOST}`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const normalizeCategory = (val) =>
  Array.isArray(val)
    ? val
    : val
    ? String(val)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

async function maybeUploadImage(imgFile) {
  if (!imgFile) return null;
  const fd = new FormData();
  fd.append('file', imgFile);
  const { data } = await api.post('api-stuffs/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data?.filename || data?.url || null;
}

export const fetchStaffAsync = createAsyncThunk('staff/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api-stuffs/stuffs', { params: { includeHidden: true } });
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const fetchStaffByCategoryPublic = createAsyncThunk(
  'staff/fetchByCategoryPublic',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api-stuffs/stuffs', { params: { category } });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const createStaffAsync = createAsyncThunk('staff/create', async (payload, { rejectWithValue }) => {
  try {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      const { data } = await api.post('/api-stuffs/stuffs-mp', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    let img = payload.img || null;
    if (payload.imgFile) img = await maybeUploadImage(payload.imgFile);
    const body = {
      name: payload.name?.trim(),
      position: payload.position || '',
      description: payload.description || '',
      profileContent: payload.profileContent || '',
      contentFormat: payload.contentFormat || 'markdown',
      img,
      category: normalizeCategory(payload.category),
      isVisible: payload.isVisible ?? true,
      sortIndex: payload.sortIndex ?? 0,
      userId: payload.userId ?? null,
    };
    const { data } = await api.post('/api-stuffs/stuffs', body);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const updateStaffAsync = createAsyncThunk('staff/update', async ({ id, changes }, { rejectWithValue }) => {
  try {
    let img = changes.img ?? null;
    if (changes.imgFile) img = await maybeUploadImage(changes.imgFile);
    const body = { ...changes, img, category: normalizeCategory(changes.category) };
    const { data } = await api.put(`/api-stuffs/stuffs/${id}`, body);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const deleteStaffAsync = createAsyncThunk('staff/delete', async ({ id, category }, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/api-stuffs/stuffs/${id}`, { params: category ? { category } : undefined });
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const toggleVisibilityStaffAsync = createAsyncThunk(
  'staff/toggleVisibility',
  async ({ id, isVisible, category }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api-stuffs/stuffs/${id}/visibility`, { isVisible, category });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const reorderStaffAsync = createAsyncThunk('staff/reorder', async (items, { rejectWithValue }) => {
  try {
    await api.patch('/api-stuffs/stuffs/reorder', { items });
    return items;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

export const copyStaffAsync = createAsyncThunk('staff/copy', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/api-stuffs/stuffs/${id}/copy`);
    return data?.copiedId;
  } catch (e) {
    return rejectWithValue(e.response?.data || e.message);
  }
});

const staffSlice = createSlice({
  name: 'staff',
  initialState: { items: [], loading: false, error: null, copiedId: null },
  reducers: {},
  extraReducers: (b) => {
    b    
      .addCase(fetchStaffAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStaffAsync.fulfilled, (s, a) => {
        s.loading = false;
        s.items = (a.payload || []).map((it) => ({
          ...it,
          category: Array.isArray(it.category)
            ? it.category
            : it.category
            ? String(it.category).split(',').map((v) => v.trim()).filter(Boolean)
            : [],
          visibilityByCategory: it.visibilityByCategory || {},
        }));
      })
      .addCase(fetchStaffAsync.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || 'Ошибка';
      })
      .addCase(createStaffAsync.fulfilled, (s, a) => {
        s.items = [...s.items, a.payload];
      })
      .addCase(updateStaffAsync.fulfilled, (s, a) => {
        s.items = s.items.map((x) => (x.id === a.payload.id ? a.payload : x));
      })     
      .addCase(deleteStaffAsync.pending, (s, a) => {
        const { id, category } = a.meta.arg || {};
        if (id == null) return;

        if (category) {
          s.items = s.items
            .map((it) => {
              if (it.id !== id) return it;
              const remaining = (it.category || []).filter((c) => c !== category);
              return remaining.length ? { ...it, category: remaining } : null;
            })
            .filter(Boolean);
        } else {
          s.items = s.items.filter((x) => x.id !== id);
        }
      })
      .addCase(deleteStaffAsync.fulfilled, (s, a) => {
        const payload = a.payload || {};
        const id = payload.id ?? a.meta?.arg?.id;

        if (payload.categoryRemoved) {
          s.items = s.items
            .map((it) => {
              if (it.id !== id) return it;
              const remaining = Array.isArray(payload.remainingCategories)
                ? payload.remainingCategories
                : (it.category || []).filter((c) => c !== payload.categoryRemoved);
              return remaining.length ? { ...it, category: remaining } : null;
            })
            .filter(Boolean);
          return;
        }

        if (payload.deleted || (payload.id && !payload.categoryRemoved)) {
          s.items = s.items.filter((x) => x.id !== id);
          return;
        }

        if (typeof payload === 'number' || typeof payload === 'string') {
          s.items = s.items.filter((x) => x.id !== payload);
        }
      })
      .addCase(deleteStaffAsync.rejected, (s, a) => {
        s.error = a.payload || a.error?.message || 'Ошибка удаления';
      })   
      .addCase(toggleVisibilityStaffAsync.pending, (s, a) => {
        const { id, isVisible, category } = a.meta.arg || {};
        s.items = s.items.map((it) => {
          if (it.id !== id) return it;
          if (category) {
            return { ...it, visibilityByCategory: { ...(it.visibilityByCategory || {}), [category]: isVisible } };
          }
          return { ...it, isVisible };
        });
      })
      .addCase(toggleVisibilityStaffAsync.fulfilled, (s, a) => {
        const { id, isVisible, category } = a.payload || {};
        s.items = s.items.map((it) => {
          if (it.id !== id) return it;
          if (category) {
            return { ...it, visibilityByCategory: { ...(it.visibilityByCategory || {}), [category]: isVisible } };
          }
          return { ...it, isVisible };
        });
      })
      .addCase(toggleVisibilityStaffAsync.rejected, (s, a) => {
        const { id, category } = a.meta.arg || {};
        s.items = s.items.map((it) => {
          if (it.id !== id) return it;
          if (category) {
            const cur = it.visibilityByCategory?.[category];
            return {
              ...it,
              visibilityByCategory:
                typeof cur === 'boolean'
                  ? { ...(it.visibilityByCategory || {}), [category]: !cur }
                  : { ...(it.visibilityByCategory || {}) },
            };
          }
          return typeof it.isVisible === 'boolean' ? { ...it, isVisible: !it.isVisible } : it;
        });
        s.error = a.payload || a.error?.message || 'Ошибка переключения видимости';
      })     
      .addCase(reorderStaffAsync.fulfilled, (s, a) => {
        const map = new Map(a.payload.map(({ id, sortIndex }) => [id, sortIndex]));
        s.items = s.items
          .map((it) => (map.has(it.id) ? { ...it, sortIndex: map.get(it.id) } : it))
          .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
      })
      .addCase(copyStaffAsync.fulfilled, (s, a) => {
        s.copiedId = a.payload;
      });
  },
});

export default staffSlice.reducer;
