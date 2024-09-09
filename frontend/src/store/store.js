import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./Slice/projectSlice";
import staffSlice from './Slice/StaffSlice';
import counterSlice from './Slice/counterSlice';
import articleSlice from "./Slice/articleSlice";
import searchProjectMainSlice from "./Slice/searchProjectMainSlice";
import searchArticlePublicLeft from "./Slice/searchArticlePublicLeftSlice";
import searchArticlePublicRightReducer from "./Slice/searchArticlePublicRightSlice";
import searchVacancyMainSlice from "./Slice/searchVacancyMainSlice";
import authReducer from "./Slice/authSlice";
import userReducer from "./Slice/userSlice";
import cursorReducer from "./Slice/cursorSlice";
import toggleSlice from "./Slice/toggleSlice";
import vacanciesSlice from "./Slice/vacanciesSlice";
import previousPageReducer from './Slice/previousPageSlice';
import activePageReducer from './Slice/activePageSlice';
import formAddSlideSlice from "./Slice/vacancyMainSlideCardSlice";
import formAddEventSlice from "./Slice/vacancyEventSlice";


export default configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    project: projectSlice,
    staff: staffSlice,
    counter: counterSlice,
    article: articleSlice,
    searchproject: searchProjectMainSlice,
    searchvacancy: searchVacancyMainSlice,
    searchArticlePublicLeft: searchArticlePublicLeft,
    searchArticlePublicRight: searchArticlePublicRightReducer,
    cursor: cursorReducer,
    toggle: toggleSlice,
    vacancies: vacanciesSlice,
    previousPage: previousPageReducer,
    activePage: activePageReducer,
    formAddSlide: formAddSlideSlice,
    formAddEvent: formAddEventSlice,
  },
 });
