import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../api/projects';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ['projects'] }, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            data: page.data.filter((p) => p.id !== id),
          })),
        };
      });
      queryClient.setQueryData(['featuredProjects'], (prev = []) =>
        prev.filter((p) => p.IdProject !== id)
      );
    },
  });
};
