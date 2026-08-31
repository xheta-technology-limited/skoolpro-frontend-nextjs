import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { assignedSubjectKeys } from "./query-keys";
import { SubjectAssignment } from "../types/api/subject-assignments";

export const listLevelSubjectAssignments = (
  level: string
): Promise<SubjectAssignment[]> =>
  api.get(`education/levels/${level}/subject-assignments`);

export const useListLevelSubjectAssignments = (
  level: string,
  options?: Partial<
    UseQueryOptions<SubjectAssignment[], ServerErrorResponse>
  >
) => {
  return useQuery<SubjectAssignment[], ServerErrorResponse>({
    queryFn: () => listLevelSubjectAssignments(level),
    queryKey: assignedSubjectKeys.detail(level),
    ...options,
  });
};
