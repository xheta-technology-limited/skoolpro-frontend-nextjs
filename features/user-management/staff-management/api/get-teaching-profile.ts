import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { staffKeys } from "./query-keys";
import { TeacherProfile } from "../types/api/teaching-profile";

export const getTeachingProfile = (
  staffId: string
): Promise<TeacherProfile> => {
  return api.get(`staff/${staffId}/teaching-profile`);
};

export const useGetTeachingProfile = (
  staffId: string,
  options?: Partial<UseQueryOptions<TeacherProfile, ServerErrorResponse>>
) => {
  return useQuery<TeacherProfile, ServerErrorResponse>({
    queryFn: () => getTeachingProfile(staffId),
    queryKey: staffKeys.teachingProfile(staffId),
    ...options,
  });
};