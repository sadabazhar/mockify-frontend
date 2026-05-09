import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiKeysApi } from '@/api/api-key';
import type { CreateApiKeyRequest, UpdateApiKeyRequest } from '@/api/types';

// ------- Query key factory -------

export const apiKeysKeys = {
  all: (orgSlug: string) => ['api-keys', orgSlug] as const,
  detail: (orgSlug: string, keyId: string) =>
    ['api-keys', orgSlug, keyId] as const,
};

// ------- Queries -------

export function useApiKeys(orgSlug: string) {
  return useQuery({
    queryKey: apiKeysKeys.all(orgSlug),
    queryFn: () => apiKeysApi.list(orgSlug),
    enabled: !!orgSlug,
    staleTime: 30_000, // keys list is fairly stable
  });
}

export function useApiKey(orgSlug: string, keyId: string) {
  return useQuery({
    queryKey: apiKeysKeys.detail(orgSlug, keyId),
    queryFn: () => apiKeysApi.getById(orgSlug, keyId),
    enabled: !!orgSlug && !!keyId,
  });
}

// ------- Mutations -------

export function useCreateApiKey(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => apiKeysApi.create(orgSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(orgSlug) });
      // Note: toast is shown by the component so it can show the key reveal
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create API key');
    },
  });
}

export function useUpdateApiKey(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      keyId,
      data,
    }: {
      keyId: string;
      data: UpdateApiKeyRequest;
    }) => apiKeysApi.update(orgSlug, keyId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        apiKeysKeys.detail(orgSlug, updated.id),
        updated,
      );
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(orgSlug) });
      toast.success('API key updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update API key');
    },
  });
}

export function useRevokeApiKey(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.revoke(orgSlug, keyId),
    // Optimistic update: immediately mark as inactive in the list cache
    onMutate: async (keyId) => {
      await queryClient.cancelQueries({ queryKey: apiKeysKeys.all(orgSlug) });
      const previous = queryClient.getQueryData(apiKeysKeys.all(orgSlug));
      queryClient.setQueryData(apiKeysKeys.all(orgSlug), (old: any[] = []) =>
        old.map((k) => (k.id === keyId ? { ...k, active: false } : k)),
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('API key revoked');
    },
    onError: (err: any, _keyId, ctx) => {
      // Roll back optimistic update on error
      if (ctx?.previous) {
        queryClient.setQueryData(apiKeysKeys.all(orgSlug), ctx.previous);
      }
      toast.error(err.response?.data?.message || 'Failed to revoke API key');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(orgSlug) });
    },
  });
}

export function useDeleteApiKey(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.delete(orgSlug, keyId),
    // Optimistic update: remove from list immediately
    onMutate: async (keyId) => {
      await queryClient.cancelQueries({ queryKey: apiKeysKeys.all(orgSlug) });
      const previous = queryClient.getQueryData(apiKeysKeys.all(orgSlug));
      queryClient.setQueryData(apiKeysKeys.all(orgSlug), (old: any[] = []) =>
        old.filter((k) => k.id !== keyId),
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('API key deleted');
    },
    onError: (err: any, _keyId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(apiKeysKeys.all(orgSlug), ctx.previous);
      }
      toast.error(err.response?.data?.message || 'Failed to delete API key');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(orgSlug) });
    },
  });
}

export function useRotateApiKey(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.rotate(orgSlug, keyId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(orgSlug) });
      queryClient.setQueryData(
        apiKeysKeys.detail(orgSlug, result.keyInfo.id),
        result.keyInfo,
      );
      // toast shown by component so it can also show the new key reveal
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to rotate API key');
    },
  });
}
