import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { assignedSubjectKeys } from "./query-keys";
import {
  ClassSectionSubject,
  ClassSectionSubjectResponse,
} from "../types/api/list-subjects-by-class-section-type";

export const listSubjectsByClassSection = (
  section: string
): Promise<ClassSectionSubjectResponse> =>
  api.get(`class-sections/${section}/subjects`, { raw: true });

export const useListSubjectsByClassSection = (
  section: string,
  options?: Partial<
    UseQueryOptions<ClassSectionSubjectResponse, ServerErrorResponse>
  >
) => {
  return useQuery<ClassSectionSubjectResponse, ServerErrorResponse>({
    queryFn: () => listSubjectsByClassSection(section),
    queryKey: assignedSubjectKeys.bySection(section),
    ...options,
  });
};
