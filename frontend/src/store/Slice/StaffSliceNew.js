import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalizeStaffCategories } from '../../Company/utils/staffVisibility';

const HOST = (process.env.REACT_APP_SERVER_HOST || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const api = axios.create({
  baseURL: `${HOST}`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
});

const normalizeCategory = (val) => normalizeStaffCategories(val);

const pickDynamicBlocks = (it) => {
  if (Array.isArray(it?.dynamicBlocks) && it.dynamicBlocks.length) return it.dynamicBlocks;
  if (Array.isArray(it?.ConstructorStaffNews) && it.ConstructorStaffNews.length) {
    return it.ConstructorStaffNews.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter((arr) => arr.length);
  }
  return [];
};

const normalizeStaffItem = (it) => ({
  ...it,
  category: normalizeStaffCategories(it?.category),
  visibilityByCategory: it?.visibilityByCategory || {},
  dynamicBlocks: pickDynamicBlocks(it),
});

const mapStaffLists = (state, mapper) => {
  state.items = mapper(state.items);
  state.adminItems = mapper(state.adminItems);
};

async function maybeUploadImage(imgFile) {
  if (!imgFile) return null;
  const fd = new FormData();
  fd.append('file', imgFile);
  const { data } = await api.post('api-stuffs/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data?.filename || data?.url || null;
}

export const uploadStaffMarkdownFile = createAsyncThunk(
  'staff/uploadStaffMarkdownFile',
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append('markdownFile', file);
      const { data } = await api.post('/api-stuffs/upload-markdown-file', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteStaffMarkdownFile = createAsyncThunk(
  'staff/deleteStaffMarkdownFile',
  async (url, { rejectWithValue }) => {
    try {
      await api.delete('/api-stuffs/delete-markdown-file', { data: { url } });
      return url;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const fetchStaffAsync = createAsyncThunk('staff/fetchAll', async (arg, { rejectWithValue }) => {
  try {
    const category = typeof arg === 'string' ? arg : arg?.category;
    const params = { includeHidden: true };
    if (category) params.category = category;
    const { data } = await api.get('/api-stuffs/stuffs', { params });
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

export const updateStaffAsync = createAsyncThunk('staff/update', async (payload, { rejectWithValue }) => {
  try {
    const { id, changes, formData } = payload || {};

    if (typeof FormData !== 'undefined' && formData instanceof FormData) {
      const { data } = await api.put(`/api-stuffs/stuffs-mp/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }

    let img = changes?.img ?? null;
    if (changes?.imgFile) img = await maybeUploadImage(changes.imgFile);
    const body = { ...changes, img, category: normalizeCategory(changes?.category) };
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
  initialState: { items: [], adminItems: [], loading: false, adminLoading: false, error: null, copiedId: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchStaffAsync.pending, (s) => {
      s.adminLoading = true;
      s.error = null;
    })
      .addCase(fetchStaffAsync.fulfilled, (s, a) => {
        s.adminLoading = false;
        s.adminItems = (a.payload || []).map(normalizeStaffItem);
      })
      .addCase(fetchStaffAsync.rejected, (s, a) => {
        s.adminLoading = false;
        s.error = a.payload || 'Ошибка';
      })
      .addCase(fetchStaffByCategoryPublic.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStaffByCategoryPublic.fulfilled, (s, a) => {
        s.loading = false;
        s.items = (a.payload || []).map(normalizeStaffItem);
      })
      .addCase(fetchStaffByCategoryPublic.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message || 'Ошибка';
      })
      .addCase(createStaffAsync.fulfilled, (s, a) => {
        const next = normalizeStaffItem(a.payload);
        mapStaffLists(s, (list) => [...list, next]);
      })
      .addCase(updateStaffAsync.fulfilled, (s, a) => {
        const updated = normalizeStaffItem(a.payload);
        mapStaffLists(s, (list) => list.map((x) => (x.id === updated.id ? updated : x)));
      })
      .addCase(deleteStaffAsync.pending, (s, a) => {
        const { id, category } = a.meta.arg || {};
        if (id == null) return;

        if (category) {
          mapStaffLists(s, (list) =>
            list
              .map((it) => {
                if (it.id !== id) return it;
                const remaining = (it.category || []).filter((c) => c !== category);
                return remaining.length ? { ...it, category: remaining } : null;
              })
              .filter(Boolean)
          );
        } else {
          mapStaffLists(s, (list) => list.filter((x) => x.id !== id));
        }
      })
      .addCase(deleteStaffAsync.fulfilled, (s, a) => {
        const payload = a.payload || {};
        const id = payload.id ?? a.meta?.arg?.id;

        if (payload.categoryRemoved) {
          mapStaffLists(s, (list) =>
            list
              .map((it) => {
                if (it.id !== id) return it;
                const remaining = Array.isArray(payload.remainingCategories)
                  ? payload.remainingCategories
                  : (it.category || []).filter((c) => c !== payload.categoryRemoved);
                return remaining.length ? { ...it, category: remaining } : null;
              })
              .filter(Boolean)
          );
          return;
        }

        if (payload.deleted || (payload.id && !payload.categoryRemoved)) {
          mapStaffLists(s, (list) => list.filter((x) => x.id !== id));
          return;
        }

        if (typeof payload === 'number' || typeof payload === 'string') {
          mapStaffLists(s, (list) => list.filter((x) => x.id !== payload));
        }
      })
      .addCase(deleteStaffAsync.rejected, (s, a) => {
        s.error = a.payload || a.error?.message || 'Ошибка удаления';
      })
      .addCase(toggleVisibilityStaffAsync.pending, (s, a) => {
        const { id, isVisible, category } = a.meta.arg || {};
        mapStaffLists(s, (list) =>
          list.map((it) => {
            if (it.id !== id) return it;
            if (category) {
              const next = {
                ...it,
                visibilityByCategory: { ...(it.visibilityByCategory || {}), [category]: isVisible },
              };
              return isVisible ? { ...next, isVisible: true } : next;
            }
            return { ...it, isVisible };
          })
        );
      })
      .addCase(toggleVisibilityStaffAsync.fulfilled, (s, a) => {
        const { id, isVisible, category } = a.payload || {};
        mapStaffLists(s, (list) =>
          list.map((it) => {
            if (it.id !== id) return it;
            if (category) {
              const next = {
                ...it,
                visibilityByCategory: { ...(it.visibilityByCategory || {}), [category]: isVisible },
              };
              return isVisible ? { ...next, isVisible: true } : next;
            }
            return { ...it, isVisible };
          })
        );
      })
      .addCase(toggleVisibilityStaffAsync.rejected, (s, a) => {
        const { id, category } = a.meta.arg || {};
        mapStaffLists(s, (list) =>
          list.map((it) => {
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
          })
        );
        s.error = a.payload || a.error?.message || 'Ошибка переключения видимости';
      })
      .addCase(reorderStaffAsync.fulfilled, (s, a) => {
        const map = new Map(a.payload.map(({ id, sortIndex }) => [id, sortIndex]));
        mapStaffLists(s, (list) =>
          list
            .map((it) => (map.has(it.id) ? { ...it, sortIndex: map.get(it.id) } : it))
            .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
        );
      })
      .addCase(copyStaffAsync.fulfilled, (s, a) => {
        s.copiedId = a.payload;
      });
  },
});

export default staffSlice.reducer;
