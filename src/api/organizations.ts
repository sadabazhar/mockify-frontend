import { apiClient as api } from '@/api/client';
import type { Organization, OrganizationDetail, PaginatedResponse } from '@/api/types';
import type { OrganizationInput } from '@/lib/validations';

export const organizationsApi = {
  getAll: async (page = 0, size = 20): Promise<PaginatedResponse<Organization>> => {
    const response = await api.get<PaginatedResponse<Organization>>('/organizations', {
      params: { page, size }, // query params -> ?page=0&size=20
    });

    return response.data;
  },

  getBySlug: async (slug: string): Promise<OrganizationDetail> => {
    const response = await api.get<OrganizationDetail>(`/organizations/${slug}`);
    return response.data;
  },

  create: async (data: OrganizationInput): Promise<Organization> => {
    const response = await api.post<Organization>('/organizations', data);
    return response.data;
  },

  update: async (
    slug: string,
    data: OrganizationInput,
  ): Promise<Organization> => {
    const response = await api.put<Organization>(`/organizations/${slug}`, data);
    return response.data;
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/organizations/${slug}`);
  },
};
