import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type { ClassAttendanceSummary } from "../types/attendance-summary-types";

// Confirmed: GET /class-sections/{section}/attendance/{term} — the
// register overview, one summary per student keyed by enrolment_id.
// Returns the unwrapped `data` map; see attendance-summary-types.ts.
export const getClassAttendanceSummary = (
  sectionId: string,
  termId: string
): Promise<ClassAttendanceSummary> => {
  return api.get(`class-sections/${sectionId}/attendance/${termId}`);
};

export const useGetClassAttendanceSummary = (
  sectionId: string,
  termId: string,
  options?: Partial<UseQueryOptions<ClassAttendanceSummary, ServerErrorResponse>>
) => {
  return useQuery<ClassAttendanceSummary, ServerErrorResponse>({
    queryKey: attendanceKeys.classSummary(sectionId, termId),
    queryFn: () => getClassAttendanceSummary(sectionId, termId),
    enabled: Boolean(sectionId) && Boolean(termId),
    ...options,
  });
};