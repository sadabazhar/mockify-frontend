import { dashboardApi } from "@/api/dashboard"
import { useQuery } from "@tanstack/react-query"

export const useUserStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'user'],
        queryFn: dashboardApi.getUserStats,
        refetchInterval: 60_000, // Refresh every 60s
    });
};

export const useOrganizationStats = (orgId: string) => {
    return useQuery({
        queryKey: ['dashboard', 'organization', orgId],
        queryFn: () => dashboardApi.getOrganizationStats(orgId),
        enabled: !!orgId,
    });
};

export const useProjectStats = (projectId: string) => {
    return useQuery({
        queryKey: ['dashboard', 'project', projectId],
        queryFn: () => dashboardApi.getProjectStats(projectId),
        enabled: !!projectId,
    });
};

export const useSchemaStats = (schemaId: string) => {
    return useQuery({
        queryKey: ['dashboard', 'schema', schemaId],
        queryFn: () => dashboardApi.getSchemaStats(schemaId),
        enabled: !!schemaId,
    });
}

export const useRecordHealthStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'record', 'health'],
        queryFn: dashboardApi.getRecordStats,
        refetchInterval: 60_000, // Refresh every 60s
    });
}