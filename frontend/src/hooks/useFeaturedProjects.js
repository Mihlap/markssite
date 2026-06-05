import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFeaturedProjects,
  addFeaturedProject,
  deleteFeaturedProject,
  updateFeaturedOrder,
} from '../api/featuredProjects';

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['featuredProjects'],
    queryFn: fetchFeaturedProjects,
  });
};

export const useAddFeaturedProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project) => addFeaturedProject(project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['featuredProjects'] }),
  });
};

export const useDeleteFeaturedProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteFeaturedProject(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['featuredProjects'], (prev = []) =>
        prev.filter((p) => p.IdProject !== id)
      );
    },
  });
};

export const useUpdateFeaturedOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projects) => updateFeaturedOrder(projects),
    onSuccess: (data) => queryClient.setQueryData(['featuredProjects'], data),
  });
};
