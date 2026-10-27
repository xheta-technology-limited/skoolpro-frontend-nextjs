import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { schoolTypeKeys } from "./query-keys";
import { SchoolType } from "../types/api/school-type";

export const listSchoolTypes = (): Promise<SchoolType[]> =>
  api.get("school-types");

export const useListSchoolTypes = (
  options?: Partial<UseQueryOptions<SchoolType[], ServerErrorResponse>>
) => {
  return useQuery<SchoolType[], ServerErrorResponse>({
    queryFn: listSchoolTypes,
    queryKey: schoolTypeKeys.all,
    ...options,
  });
};
