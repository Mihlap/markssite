import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArticles } from '../api/articles';

export const useArticles = ({ limit = 6, type = 'Все' } = {}) => {
  return useInfiniteQuery({
    queryKey: ['articles', { limit, type }],
    queryFn: ({ pageParam }) => fetchArticles({ page: pageParam, limit, type }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination) return undefined;
      const { page, totalPages } = pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
