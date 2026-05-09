import { apiClient } from './client';
import type { ApplyTemplateResponse, SchemaTemplate } from './types';

export const schemaTemplatesApi = {
    // Get all system templates (metadata only, no schemaJson)
    getSystemTemplates: async (): Promise<SchemaTemplate[]> => {
        const response = await apiClient.get<SchemaTemplate[]>(
            '/schema-templates/system'
        );
        return response.data;
    },

    // Apply a template to a specific project
    applyTemplate: async (
        orgSlug: string,
        projectSlug: string,
        templateSlug: string
    ): Promise<ApplyTemplateResponse> => {
        const response = await apiClient.post<ApplyTemplateResponse>(
            `/schema-templates/${orgSlug}/${projectSlug}/${templateSlug}`
        );
        return response.data;
    },
};