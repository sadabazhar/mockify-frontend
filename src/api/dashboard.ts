import { apiClient } from "./client";
import type {UserStats, OrganizationStats, ProjectStats, SchemaStats, RecordHealthStats} from "./types";

export const dashboardApi = {
    getUserStats: async (): Promise<UserStats> => {
        const response = await apiClient.get<UserStats>('/dashboard/user');
        return response.data;
    },

    getOrganizationStats: async (orgId: string): Promise<OrganizationStats> => {
        const response = await apiClient.get<OrganizationStats>(`/dashboard/organization/${orgId}`);
        return response.data;
    },

    getProjectStats: async (projectId: string): Promise<ProjectStats> => {
        const response = await apiClient.get<ProjectStats>(`/dashboard/project/${projectId}`);
        return response.data;
    },

    getSchemaStats: async (schemaId: string): Promise<SchemaStats> => {
        const response = await apiClient.get<SchemaStats>(`/dashboard/schema/${schemaId}`);
        return response.data;
    },

    getRecordStats: async (): Promise<RecordHealthStats> => {
        const response = await apiClient.get<RecordHealthStats>(`/dashboard/record/health`);
        return response.data;
    }
};