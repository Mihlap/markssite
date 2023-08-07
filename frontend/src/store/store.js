import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import projectSlice from "./Slice/projectSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';
import authSlice from './Slice/authSlice';
import articleSlice from "./Slice/articleSlice";
import searchProjectMainSlice from "./Slice/searchProjectMainSlice";
import searchArticlePublicLeft from "./Slice/searchArticlePublicLeftSlice";
import cursorReducer from "./Slice/cursorSlice";


export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    project: projectSlice,
    staff: staffSlice,
    counter: counterSlice,
    auth: authSlice,
    article: articleSlice,
    searchproject: searchProjectMainSlice,
    searchArticlePublicLeft: searchArticlePublicLeft,
    cursor: cursorReducer,
  },
});
