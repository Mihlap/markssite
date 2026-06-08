import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../api/projects';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formattedData }) => updateProject(id, formattedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
