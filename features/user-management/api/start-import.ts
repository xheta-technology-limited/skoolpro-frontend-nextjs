import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";
import { StartImportFormData } from "../schemas/start-import";

export const startImport = (
  data: StartImportFormData
): Promise<ImportRecord> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("module", data.module || "");
  formData.append("entity_type", data.entity_type || "");

  return api.post("imports", formData);
};

export const useStartImport = () => {
  return useMutation<ImportRecord, ServerErrorResponse, StartImportFormData>({
    mutationFn: (data) => startImport(data),
  });
};
