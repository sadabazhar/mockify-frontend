import { apiClient } from './client';
import type { MockRecord, PaginatedResponse } from './types';

export const recordsApi = {
  create: async (
    orgSlug: string,
    projectSlug: string,
    schemaSlug: string,
    body: { data: Record<string, any> },
  ): Promise<MockRecord> => {
    const response = await apiClient.post<MockRecord>(
      `/${orgSlug}/${projectSlug}/${schemaSlug}/records`,
      {
        data: body.data,
      },
    );
    return response.data;
  },

  getAll: async (
    orgSlug: string,
    projectSlug: string,
    schemaSlug: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<MockRecord>> => {
    const response = await apiClient.get<PaginatedResponse<MockRecord>>(
      `/${orgSlug}/${projectSlug}/${schemaSlug}/records`,
      {
        params: { page, size }, // query params -> ?page=0&size=20
      }
    );

    return response.data;
  },

  getById: async (
    orgSlug: string,
    projectSlug: string,
    schemaSlug: string,
    recordId: string
  ): Promise<MockRecord> => {
    const response = await apiClient.get<MockRecord>(
      `/${orgSlug}/${projectSlug}/${schemaSlug}/records/${recordId}`,
    );
    return response.data;
  },

  update: async (
    orgSlug: string,
    projectSlug: string,
    schemaSlug: string,
    recordId: string,
    data: { data: Record<string, any>; ttlMinutes?: number },
  ): Promise<MockRecord> => {
    const response = await apiClient.put<MockRecord>(
      `/${orgSlug}/${projectSlug}/${schemaSlug}/records/${recordId}`,
      data,
    );
    return response.data;
  },

  delete: async (
    orgSlug: string,
    projectSlug: string,
    schemaSlug: string,
    recordId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/${orgSlug}/${projectSlug}/${schemaSlug}/records/${recordId}`
    );
  },
};
