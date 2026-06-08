import { useQuery } from '@tanstack/react-query';
import { fetchProject } from '../api/projects';

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
};
