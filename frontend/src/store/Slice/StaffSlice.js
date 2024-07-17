import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const DEFAULT_CATEGORY = "Руководство";
const host = process.env.REACT_APP_SERVER_HOST;

const staffSlice = createSlice({
  name: "staff",
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
      state.allImagesLoaded = false;
    },
    fetchStaffSuccess(state, action) {
      state.loading = false;
      const staffWithImages = action.payload.map((staff) => ({
        ...staff,
        imgLoaded: false,
      }));
      state.staff = staffWithImages;
    },
    fetchStaffFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectCard(state, action) {
      const selectedCardId = action.payload;
      const selectedCard = state.staff.find((staff) => staff.id === selectedCardId);
      if (selectedCardId === state.selectedCardId) {
        return state;
      }
      return {
        ...state,
        selectedCardId,
        selectedCard: selectedCard ? selectedCard : null,
      };
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    imageLoadSuccess(state, action) {
      const { staffId } = action.payload;
      state.staff = state.staff.map((staff) =>
        staff.id === staffId ? { ...staff, imgLoaded: true } : staff
      );
      const allImagesLoaded = state.staff.every((staff) => staff.imgLoaded);
      state.allImagesLoaded = allImagesLoaded; 
    },
  },
});

export const {
  fetchStaffStart,
  fetchStaffSuccess,
  fetchStaffFailure,
  selectCard,
  setCategory,
  imageLoadSuccess,
} = staffSlice.actions;

export const fetchCategoryStaff = (category) => async (dispatch) => {
  dispatch(fetchStaffStart());

  try {
    const response = await axios.get(`${host}/api-stuffs/stuffs`);

    const staff = response.data;
    const filteredData = staff.filter((staff) => staff.category.includes(category));

    filteredData.forEach((staff) => {
      const { id, img } = staff;
      const image = new Image();
      image.src = `${host}/images/imageStuff/${img}`; 
      image.onload = () => dispatch(imageLoadSuccess({ staffId: id }));
    });

    dispatch(setCategory(category));
    dispatch(fetchStaffSuccess(filteredData));
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      dispatch(fetchStaffFailure('Время ожидания запроса истекло'));
    } else {
      dispatch(fetchStaffFailure(error.message));
    }
  }
};


export default staffSlice.reducer;


