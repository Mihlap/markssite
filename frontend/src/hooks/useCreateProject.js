import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../api/projects';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formattedData) => createProject(formattedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
