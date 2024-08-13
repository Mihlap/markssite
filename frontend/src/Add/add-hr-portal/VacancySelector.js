import { createSelector } from "reselect";

const vacanciesSelector = (state) => state.searchvacancy?.vacancies;

export const arrIdVacancySelector = createSelector(
  vacanciesSelector,
  (vacancies) => vacancies?.map((el) => el)
);
