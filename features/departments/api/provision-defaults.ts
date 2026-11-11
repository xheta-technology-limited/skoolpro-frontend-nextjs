import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { Department } from "@/types";
import { departmentKeys } from "./query-keys";

export type ProvisionDefaultsPayload = {
  preset?: string;
};

export type ProvisionDefaultsResult = {
  preset: string;
  created: string[];
  skipped: Record<string, string>;
  total: number;
  created_count: number;
  skipped_count: number;
  departments: Department[];
};

/** Create the departments in a default preset. */
export const provisionDefaults = (
  data: ProvisionDefaultsPayload
): Promise<ProvisionDefaultsResult> => {
  return api.post("departments/provision", data);
};

/** Mutation hook that provisions defaults and refreshes department queries. */
export const useProvisionDefaults = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProvisionDefaultsResult,
    ServerErrorResponse,
    ProvisionDefaultsPayload
  >({
    mutationFn: (data) => {
      return provisionDefaults(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
