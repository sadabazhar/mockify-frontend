import { schemasApi } from '@/api/schemas';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSchemas(
  orgSlug: string, 
  projectSlug: string,
) {
  return useQuery({
    queryKey: ['schemas', orgSlug, projectSlug],
    queryFn: () =>
      schemasApi.getByProject(orgSlug, projectSlug),
    enabled: !!orgSlug && !!projectSlug,
  });
}

export function useSchema(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
) {
  return useQuery({
    queryKey: ['schemas', orgSlug, projectSlug, schemaSlug],
    queryFn: () =>
      schemasApi.getBySlug(orgSlug, projectSlug, schemaSlug),
    enabled: !!orgSlug && !!projectSlug && !!schemaSlug,
  });
}

export function useCreateSchema(
  orgSlug: string, 
  projectSlug: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      schemaJson: Record<string, any>;
    }) =>
      schemasApi.create(orgSlug, projectSlug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schemas', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
      queryClient.invalidateQueries({queryKey: ['dashboard', 'project']}); 
      queryClient.invalidateQueries({queryKey: ['dashboard', 'schema']}); 
    },
  });
}

export function useUpdateSchema(
  orgSlug: string, 
  projectSlug: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schemaSlug,
      data,
    }: {
      schemaSlug: string;
      data: { name: string; schemaJson: Record<string, any> };
    }) =>
      schemasApi.update(orgSlug, projectSlug, schemaSlug, data),

    onSuccess: (_, { schemaSlug }) => {
      queryClient.invalidateQueries({
        queryKey: ['schemas', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'schemas',
          orgSlug,
          projectSlug,
          schemaSlug,
        ],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
      queryClient.invalidateQueries({queryKey: ['dashboard', 'project']}); 
    },
  });
}

export function useDeleteSchema(
  orgSlug: string, 
  projectSlug: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schemaSlug: string) =>
      schemasApi.delete(orgSlug, projectSlug, schemaSlug),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
      queryClient.invalidateQueries({queryKey: ['dashboard', 'project']}); 
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete schema',
      );
    },
    
  });
}