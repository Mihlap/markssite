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
    deleteReviewSuccess(state, action) {
      const reviewId = action.payload;
      state.reviews = state.reviews.filter((review) => review.id !== reviewId);
    },
    deleteReviewFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  deleteReviewSuccess,
  deleteReviewFailure,
} = reviewsSlice.actions;

export const fetchReviews = () => async (dispatch) => {
  dispatch(fetchReviewsStart());

  try {
    const response = await axios.get(`${host}/api/reviews`);
    dispatch(fetchReviewsSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchReviewsFailure(error.message));
  }
};

export const deleteReview = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${host}/api/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(deleteReviewSuccess(id));
  } catch (error) {
    dispatch(deleteReviewFailure(error.message));
  }
};

export default reviewsSlice.reducer;
