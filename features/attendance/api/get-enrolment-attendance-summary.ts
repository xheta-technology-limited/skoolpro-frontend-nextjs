import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  EnrolmentAttendanceSummary,
  GetEnrolmentAttendanceParams,
} from "../types/attendance-summary-types";

// Confirmed: GET /enrolments/{enrolment}/attendance/{term}?from=&to=.
// `from`/`to` optionally narrow to a date range within the term.
export const getEnrolmentAttendanceSummary = (
  enrolmentId: string,
  termId: string,
  params: GetEnrolmentAttendanceParams = {}
): Promise<EnrolmentAttendanceSummary> => {
  return api.get(`enrolments/${enrolmentId}/attendance/${termId}`, {
    params,
  });
};

export const useGetEnrolmentAttendanceSummary = (
  enrolmentId: string,
  termId: string,
  params: GetEnrolmentAttendanceParams = {},
  options?: Partial<
    UseQueryOptions<EnrolmentAttendanceSummary, ServerErrorResponse>
  >
) => {
  return useQuery<EnrolmentAttendanceSummary, ServerErrorResponse>({
    queryKey: attendanceKeys.enrolmentSummary(enrolmentId, termId, params),
    queryFn: () => getEnrolmentAttendanceSummary(enrolmentId, termId, params),
    enabled: Boolean(enrolmentId) && Boolean(termId),
    ...options,
  });
};