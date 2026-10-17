import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type { AttendanceStatus } from "../types/attendance-status-types";

// Confirmed: GET /attendance-statuses — no params, not paginated.
// No `raw: true`: only the inner data array is needed, which is what
// the api client returns by default.
export const getAttendanceStatuses = (): Promise<AttendanceStatus[]> => {
  return api.get("attendance-statuses");
};

export const useGetAttendanceStatuses = (
  options?: Partial<UseQueryOptions<AttendanceStatus[], ServerErrorResponse>>
) => {
  return useQuery<AttendanceStatus[], ServerErrorResponse>({
    queryKey: attendanceKeys.statuses(),
    queryFn: getAttendanceStatuses,
    ...options,
  });
};