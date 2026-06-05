import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/projects';

export const useProjects = ({ limit = 12, view = 'Все', city = '' } = {}) => {
  return useInfiniteQuery({
    queryKey: ['projects', { limit, view, city }],
    queryFn: ({ pageParam }) => fetchProjects({ page: pageParam, limit, view, city }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
