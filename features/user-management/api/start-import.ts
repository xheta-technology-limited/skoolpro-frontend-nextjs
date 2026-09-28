import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { ImportRecord } from "../types/api/template";
import { StartImportFormData } from "../schemas/start-import";

export const startImport = <ColumnMapping extends Record<string, string>>(
  data: StartImportFormData
): Promise<ImportRecord<ColumnMapping>> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("module", data.module || "");
  formData.append("entity_type", data.entity_type || "");

  return api.post("imports", formData);
};

export const useStartImport = <
  ColumnMapping extends Record<string, string>
>() => {
  return useMutation<
    ImportRecord<ColumnMapping>,
    ServerErrorResponse,
    StartImportFormData
  >({
    mutationFn: (data) => startImport(data),
  });
};
