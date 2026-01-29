import { recordsApi } from '@/api/records';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRecords(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
) {
  return useQuery({
    queryKey: ['records', orgSlug, projectSlug, schemaSlug],
    queryFn: () =>
      recordsApi.getAll(orgSlug, projectSlug, schemaSlug),
    enabled: !!orgSlug && !!projectSlug && !!schemaSlug,
  });
}

export function useRecord(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
  recordId: string
) {
  return useQuery({
    queryKey: ['records', recordId],
    queryFn: () => recordsApi.getById(orgSlug, projectSlug, schemaSlug, recordId),
    enabled: !!recordId,
  });
}

export function useCreateRecord(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      recordsApi.create(orgSlug, projectSlug, schemaSlug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['records', orgSlug, projectSlug, schemaSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['schemas', orgSlug, projectSlug, schemaSlug],
      });
            queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
        queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
        queryClient.invalidateQueries({queryKey: ['dashboard', 'project']});
        queryClient.invalidateQueries({queryKey: ['dashboard', 'schema']});  
      toast.success('Record created successfully');
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create record');
    },
  });
}

export function useUpdateRecord(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
  recordId: string
) {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (data: Record<string, any>) =>
      recordsApi.update(orgSlug, projectSlug, schemaSlug, recordId, data),

    onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: ['records', result.id] });
        queryClient.invalidateQueries({
        queryKey: ['schemas', result.schemaId, 'records'],
      });
        queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
        queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
        queryClient.invalidateQueries({queryKey: ['dashboard', 'project']});
        queryClient.invalidateQueries({queryKey: ['dashboard', 'schema']}); 
      toast.success('Record updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update record');
    },
  });
}

export function useDeleteRecord(
  orgSlug: string,
  projectSlug: string,
  schemaSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) =>
      recordsApi.delete(orgSlug, projectSlug, schemaSlug, recordId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schemas', orgSlug, projectSlug, schemaSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
      queryClient.invalidateQueries({queryKey: ['dashboard', 'project']}); 
      queryClient.invalidateQueries({queryKey: ['dashboard', 'schema']}); 
      toast.success('Record deleted successfully');
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    },
  });
}
