import { apiClient as api } from "./client";
import type { OpenApiImportResponse } from "./types";

export const OpenApi = {
  import: async (
    orgSlug: string,
    projectSlug: string,
    file: File,
  ): Promise<OpenApiImportResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<OpenApiImportResponse>(
    `${orgSlug}/${projectSlug}/import/openapi`,
    formData
    );

    return data;
  },
};