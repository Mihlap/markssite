import { configureStore } from "@reduxjs/toolkit";
// импортируйте ваши редьюсеры здесь
import projectSlice from "./Slice/projectSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';
import articleSlice from "./Slice/articleSlice";
import searchProjectMainSlice from "./Slice/searchProjectMainSlice";
import searchArticlePublicLeft from "./Slice/searchArticlePublicLeftSlice";
import searchArticlePublicRightReducer from "./Slice/searchArticlePublicRightSlice";
import authReducer from "./Slice/authSlice";
import userReducer from "./Slice/userSlice";
import cursorReducer from "./Slice/cursorSlice";
import toggleSlice from "./Slice/toggleSlice";
import vacanciesSlice from "./Slice/vacanciesSlice";


export default configureStore({
  reducer: {
    // добавьте все ваши редьюсеры здесь
    user: userReducer,
    auth: authReducer,
    project: projectSlice,
    staff: staffSlice,
    counter: counterSlice,
    article: articleSlice,
    searchproject: searchProjectMainSlice,
    searchArticlePublicLeft: searchArticlePublicLeft,
    searchArticlePublicRight: searchArticlePublicRightReducer,
    cursor: cursorReducer,
    toggle: toggleSlice,
    vacancies: vacanciesSlice,
  },
 });
