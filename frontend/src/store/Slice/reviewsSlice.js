import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


 const host = process.env.REACT_APP_DEV_HOST;

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchReviewsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchReviewsSuccess(state, action) {
      state.loading = false;
      state.reviews = action.payload;
    },
    fetchReviewsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure } =
  reviewsSlice.actions;

export const fetchReviews = () => async (dispatch) => {
  dispatch(fetchReviewsStart());

  try {
    const response = await axios.get(`${host}/api/reviews`);
    dispatch(fetchReviewsSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchReviewsFailure(error.message));
  }
};

export default reviewsSlice.reducer;
