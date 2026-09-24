import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord, StartImportPayload } from "../types/api/template";

export const startImport = (
  data: StartImportPayload
): Promise<ImportRecord> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("module", data.module);
  formData.append("entity_type", data.entity_type);

  return api.post("imports", formData);
};

export const useStartImport = () => {
  return useMutation<ImportRecord, ServerErrorResponse, StartImportPayload>({
    mutationFn: (data) => startImport(data),
  });
};
