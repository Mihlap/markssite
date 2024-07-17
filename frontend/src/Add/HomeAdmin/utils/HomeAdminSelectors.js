import { createSelector } from "reselect";

// Selector to get the projects data from the Redux state
const projectsSelector = (state) => state.searchproject.projects;

// Memoized selector to extract the array of IdProject values
export const arrIdProjectSelector = createSelector(
  projectsSelector,
  (projects) => projects?.map((el) => el)
);
