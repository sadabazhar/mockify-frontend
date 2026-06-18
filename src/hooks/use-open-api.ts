import { OpenApi } from "@/api/openapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ImportParams {
    file: File;
    orgSlug: string;
    projectSlug: string;
}

export function useImportOpenApi() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, orgSlug, projectSlug }: ImportParams) =>
        OpenApi.import(orgSlug, projectSlug, file),

        onSuccess: (response, variables) => {
        const { orgSlug, projectSlug } = variables;

        // Refresh project and schema details
        queryClient.invalidateQueries({queryKey: ['schemas', orgSlug, projectSlug],});
        queryClient.invalidateQueries({queryKey: ['projects', orgSlug, projectSlug],});

        // Refresh dashboard stats that might be affected by the new schemas
        queryClient.invalidateQueries({queryKey: ['dashboard', 'user']});
        queryClient.invalidateQueries({queryKey: ['dashboard', 'project']}); 
        queryClient.invalidateQueries({queryKey: ['dashboard', 'schema']}); 

        toast.success(
            `Imported ${response.totalImported} schema${response.totalImported === 1 ? "" : "s"}`
        );
        },
    });
}