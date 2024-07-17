import { createSelector } from "reselect";

// Selector to get the projects data from the Redux state
const searchArticlePublicLeft = (state) =>
  state.searchArticlePublicLeft.articleLeft;

// Memoized selector to extract the last IdProject value
export const arrIdArticlesLeftSelector = createSelector(
  searchArticlePublicLeft,
  (articleLeft) => articleLeft?.map((el) => el)
);
