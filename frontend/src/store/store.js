import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import reviewsSlice from "./Slice/reviewsSlice";
import articlesSlice from "./Slice/articlesSlice";
import projectSlice from "./Slice/projectSlice";
import loginSlice from "./Slice/loginSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';


export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    reviews: reviewsSlice,
    articles: articlesSlice,
    project: projectSlice,
    login: loginSlice,
    staff: staffSlice,
    counter: counterSlice,
  },
});
