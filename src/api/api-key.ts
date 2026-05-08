import { apiClient } from './client';
import type {
  ApiKeyResponse,
  CreateApiKeyRequest,
  CreateApiKeyResult,
  UpdateApiKeyRequest,
} from './types';

/**
 * All endpoints live under /api/{org}/api-keys
 * ALL calls require JWT authentication — API keys cannot manage API keys.
 */
export const apiKeysApi = {
  /**
   * GET /api/{org}/api-keys
   * Returns all API keys for the organisation (active + revoked).
   */
  list: async (orgSlug: string): Promise<ApiKeyResponse[]> => {
    const res = await apiClient.get<ApiKeyResponse[]>(`/${orgSlug}/api-keys`);
    return res.data;
  },

  /**
   * GET /api/{org}/api-keys/{keyId}
   */
  getById: async (orgSlug: string, keyId: string): Promise<ApiKeyResponse> => {
    const res = await apiClient.get<ApiKeyResponse>(
      `/${orgSlug}/api-keys/${keyId}`,
    );
    return res.data;
  },

  /**
   * POST /api/{org}/api-keys
   * Returns CreateApiKeyResult — plainTextKey is shown ONCE, then gone.
   */
  create: async (
    orgSlug: string,
    data: CreateApiKeyRequest,
  ): Promise<CreateApiKeyResult> => {
    const res = await apiClient.post<CreateApiKeyResult>(
      `/${orgSlug}/api-keys`,
      data,
    );
    return res.data;
  },

  /**
   * PUT /api/{org}/api-keys/{keyId}
   * Supports partial updates: name, description, rateLimitPerMinute.
   */
  update: async (
    orgSlug: string,
    keyId: string,
    data: UpdateApiKeyRequest,
  ): Promise<ApiKeyResponse> => {
    const res = await apiClient.put<ApiKeyResponse>(
      `/${orgSlug}/api-keys/${keyId}`,
      data,
    );
    return res.data;
  },

  /**
   * POST /api/{org}/api-keys/{keyId}/revoke
   * Marks key as inactive. Key remains in the list with active: false.
   */
  revoke: async (orgSlug: string, keyId: string): Promise<ApiKeyResponse> => {
    const res = await apiClient.post<ApiKeyResponse>(
      `/${orgSlug}/api-keys/${keyId}/revoke`,
    );
    return res.data;
  },

  /**
   * DELETE /api/{org}/api-keys/{keyId}
   * Permanently deletes the key record.
   */
  delete: async (orgSlug: string, keyId: string): Promise<void> => {
    await apiClient.delete(`/${orgSlug}/api-keys/${keyId}`);
  },

  /**
   * POST /api/{org}/api-keys/{keyId}/rotate
   * Generates a new secret, invalidates the old one.
   * Returns CreateApiKeyResult — new plainTextKey is shown ONCE.
   */
  rotate: async (
    orgSlug: string,
    keyId: string,
  ): Promise<CreateApiKeyResult> => {
    const res = await apiClient.post<CreateApiKeyResult>(
      `/${orgSlug}/api-keys/${keyId}/rotate`,
    );
    return res.data;
  },
};
