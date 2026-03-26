import { createSelector } from 'reselect';

// Selector to get the projects data from the Redux state
const searchArticlePublicRight = (state) => state.searchArticlePublicRight.articleRight;

// Memoized selector to extract the last IdProject value
export const arrIdArticlesRightSelector = createSelector(searchArticlePublicRight, (articleRight) =>
  articleRight?.map((el) => el)
);
