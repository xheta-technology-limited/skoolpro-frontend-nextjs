import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { departmentKeys } from "./query-keys";

export type DefaultDepartment = {
  name: string;
  code: string;
  description: string;
};

export type DefaultDepartmentPreset = {
  label: string;
  departments: DefaultDepartment[];
};

export type DepartmentDefaults = {
  presets: Record<string, DefaultDepartmentPreset>;
};

export const listDefaults = (): Promise<DepartmentDefaults> =>
  api.get("departments/provision");

export const useListDefaults = (
  options?: Partial<UseQueryOptions<DepartmentDefaults, ServerErrorResponse>>
) => {
  return useQuery<DepartmentDefaults, ServerErrorResponse>({
    queryFn: listDefaults,
    queryKey: departmentKeys.defaults,
    ...options,
  });
};
