import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationsApi } from '@/api/organizations';
import type { OrganizationInput } from '@/lib/validations';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationsApi.getAll,
  });
}

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: ['organizations', slug],
    queryFn: () => organizationsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrganizationInput) => organizationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create organization',
      );
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: OrganizationInput }) =>
      organizationsApi.update(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', slug] });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update organization',
      );
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => organizationsApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete organization',
      );
    },
  });
}
