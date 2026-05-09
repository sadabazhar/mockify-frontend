import { apiClient as api } from '@/api/client';
import type { PaginatedResponse, Project, ProjectDetail } from '@/api/types';

export const projectsApi = {
 getAllByOrg: async (orgSlug: string): Promise<Project[]> => {
  const response = await api.get<PaginatedResponse<Project>>(`/${orgSlug}/projects`);
  const { data: projects } = response.data;
  return projects;
 },

  getBySlug: async (
    orgSlug: string, projectSlug: string
  ): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/${orgSlug}/${projectSlug}`);
    return response.data;
  },

  create: async (
    orgSlug: string,
    data: { name: string },
  ): Promise<Project> => {
    const response = await api.post(`/${orgSlug}/projects`, data);
    return response.data;
  },

 update: async (
    orgSlug: string,
    projectSlug: string,
    data: { name: string },
  ): Promise<Project> => {
    const response = await api.put(`/${orgSlug}/${projectSlug}`, data);
    return response.data;
  },

  delete: async (
    orgSlug: string,
    projectSlug: string
  ): Promise<void> => {
    await api.delete(`/${orgSlug}/${projectSlug}`);
  },
};
