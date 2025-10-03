import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const host = process.env.REACT_APP_SERVER_HOST;
const DEFAULT_CATEGORY = 'Руководство';

const parseCategories = (val) => {
  if (val == null) return [];
  if (Array.isArray(val))
    return val
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);

  const s = String(val).trim();
  if (!s) return [];

  if (s.startsWith('{') && s.endsWith('}')) {
    return s
      .slice(1, -1)
      .split(',')
      .map((x) => x.replace(/(^"|"$)/g, '').trim())
      .filter(Boolean);
  }

  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr))
        return arr
          .map(String)
          .map((x) => x.trim())
          .filter(Boolean);
    } catch (_) {}
  }

  if (s.includes(',')) {
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [s];
};

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    category: DEFAULT_CATEGORY,
    selectedCardId: null,
    selectedCard: null,
    staff: [],
    loading: false,
    error: null,
    allImagesLoaded: false,
  },
  reducers: {
    fetchStaffStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStaffSuccess(state, action) {
      state.loading = false;
      state.staff = action.payload;
    },
    fetchStaffFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectCard(state, action) {
      const selectedCardId = action.payload;
      const selectedCard = state.staff.find((staff) => staff.id === selectedCardId);
      state.selectedCardId = selectedCardId;
      state.selectedCard = selectedCard || null;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
  },
});

export const { fetchStaffStart, fetchStaffSuccess, fetchStaffFailure, selectCard, setCategory } = staffSlice.actions;

export const fetchCategoryStaff = () => async (dispatch) => {
  dispatch(fetchStaffStart());

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await axios.get(`${host}/api-stuffs/stuffs`);
  
    const staffData = (Array.isArray(response.data) ? response.data : []).map((staff) => {
      const categories = parseCategories(staff.category);
      return {
        ...staff,
        _categories: categories,
        img: `${process.env.REACT_APP_S3_BUCKET_URL}/images/imageStuff/${staff.img || 'no_photo.png'}`,
      };
    });

    dispatch(fetchStaffSuccess(staffData));
  } catch (error) {
    const errorMessage = error?.response?.data?.error || error?.message || 'Ошибка при загрузке данных';
    dispatch(fetchStaffFailure(errorMessage));
  }
};

export default staffSlice.reducer;
