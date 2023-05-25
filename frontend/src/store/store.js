import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import counterSlice from "./Slice/counterSlice";
import reviewsSlice from "./Slice/reviewsSlice";
import articlesSlice from "./Slice/articlesSlice";

export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    counterSlice: counterSlice,
    reviews: reviewsSlice,
    articles: articlesSlice,
  },
});
