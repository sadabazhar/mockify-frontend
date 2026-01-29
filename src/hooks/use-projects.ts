import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/api/projects';
import type { ProjectInput } from '@/lib/validations';

export function useProjects(orgSlug: string) {
  return useQuery({
    queryKey: ['projects', orgSlug],
    queryFn: () => projectsApi.getAllByOrg(orgSlug),
    enabled: !!orgSlug,
  });
}

export function useProject(orgSlug: string, projectSlug: string) {
  return useQuery({
    queryKey: ['projects', orgSlug, projectSlug],
    queryFn: () => projectsApi.getBySlug(orgSlug, projectSlug),
    enabled: !!orgSlug && !!projectSlug,
  });
}

export function useCreateProject(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      projectsApi.create(orgSlug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['organizations', orgSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
  });
}

export function useUpdateProject(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectSlug,
      data,
    }: {
      projectSlug: string;
      data: { name: string };
    }) => projectsApi.update(orgSlug, projectSlug, data),

    onSuccess: (_, { projectSlug }) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
  });
}

export function useDeleteProject(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectSlug: string) =>
      projectsApi.delete(orgSlug, projectSlug),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['organizations', orgSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
  });
}
