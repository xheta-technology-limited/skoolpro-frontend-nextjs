import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolProfileKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { SchoolProfile } from "../types/school-profile";

export const getSchoolProfile = (): Promise<SchoolProfile> => {
  return api.get("school");
};

export const useGetSchoolProfile = (
  options?: Partial<UseQueryOptions<SchoolProfile, ServerErrorResponse>>
) => {
  return useQuery<SchoolProfile, ServerErrorResponse>({
    queryFn: getSchoolProfile,
    queryKey: schoolProfileKeys.all,
    ...options,
  });
};
