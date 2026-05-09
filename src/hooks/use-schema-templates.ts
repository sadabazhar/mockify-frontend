import { schemaTemplatesApi } from '@/api/schema-templates';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Fetch all system templates
export function useSystemTemplates() {
  return useQuery({
    queryKey: ['schema-templates', 'system'],
    queryFn: schemaTemplatesApi.getSystemTemplates,
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });
}

// Apply template to a project
export function useApplyTemplate(orgSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateSlug: string) =>
      schemaTemplatesApi.applyTemplate(orgSlug, projectSlug, templateSlug),

    onSuccess: (data) => {
      toast.success(`Schema "${data.name}" created`);

      // refresh related data after mutation
      queryClient.invalidateQueries({
        queryKey: ['projects', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['schemas', orgSlug, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to apply template'
      );
    },
  });
}