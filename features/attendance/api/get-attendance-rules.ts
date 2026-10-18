import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type { AttendanceRule } from "../types/attendance-rule-types";

// Confirmed: GET /attendance-rules — no params, not paginated. No
// `raw: true`: only the inner data array is needed, which is what the
// api client returns by default.
export const getAttendanceRules = (): Promise<AttendanceRule[]> => {
  return api.get("attendance-rules");
};

export const useGetAttendanceRules = (
  options?: Partial<UseQueryOptions<AttendanceRule[], ServerErrorResponse>>
) => {
  return useQuery<AttendanceRule[], ServerErrorResponse>({
    queryKey: attendanceKeys.rules(),
    queryFn: getAttendanceRules,
    ...options,
  });
};