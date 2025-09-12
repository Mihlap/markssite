import { configureStore } from '@reduxjs/toolkit';
import projectSlice from './Slice/projectSlice';
import staffSlice from './Slice/StaffSlice';
import StaffSliceNew from './Slice/StaffSliceNew';
import counterSlice from './Slice/counterSlice';
import articleSlice from './Slice/articleSlice';
import searchProjectMainSlice from './Slice/searchProjectMainSlice';
import searchArticlePublicLeft from './Slice/searchArticlePublicLeftSlice';
import searchArticlePublicRightReducer from './Slice/searchArticlePublicRightSlice';
import searchVacancyMainSlice from './Slice/searchVacancyMainSlice';
import authReducer from './Slice/authSlice';
import userReducer from './Slice/userSlice';
import cursorReducer from './Slice/cursorSlice';
import toggleSlice from './Slice/toggleSlice';
import vacanciesSlice from './Slice/vacanciesSlice';
import previousPageReducer from './Slice/previousPageSlice';
import activePageReducer from './Slice/activePageSlice';
import formAddSlideSlice from './Slice/vacancyMainSlideCardSlice';
import formAddEventSlice from './Slice/vacancyEventSlice';
import modalSlice from './Slice/modalSlice';
import journalSlice from './Slice/journalSlice';
import journal_categoryFiltersSlice from './Slice/journal_categoryFiltersSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    project: projectSlice,
    // staff: staffSlice,
    staff: StaffSliceNew,
    counter: counterSlice,
    article: articleSlice,
    searchproject: searchProjectMainSlice,
    searchvacancy: searchVacancyMainSlice,
    searchArticlePublicLeft: searchArticlePublicLeft,
    searchArticlePublicRight: searchArticlePublicRightReducer,
    journal: journalSlice,
    cursor: cursorReducer,
    toggle: toggleSlice,
    vacancies: vacanciesSlice,
    previousPage: previousPageReducer,
    activePage: activePageReducer,
    formAddSlide: formAddSlideSlice,
    formAddEvent: formAddEventSlice,
    modal: modalSlice,
    categoryFilters: journal_categoryFiltersSlice,
  },
});
