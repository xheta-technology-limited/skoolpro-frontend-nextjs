import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  AttendanceSession,
  GetRegisterParams,
  GetRegisterResponse,
} from "../types/attendance-register-types";

// Confirmed: GET /class-sections/{section}/register/{term}?date=&type=.
// Returns the session with its records, or { data: null } plus a
// message when nothing has been marked for that date/type.
//
// `raw: true` keeps the whole { data, message } envelope: the api
// client's default unwrapping isn't confirmed to cope with a null
// `data`, and `select` below does the unwrap explicitly instead.
export const getRegister = (
  sectionId: string,
  termId: string,
  params: GetRegisterParams = {}
): Promise<GetRegisterResponse> => {
  return api.get(`class-sections/${sectionId}/register/${termId}`, {
    params,
    raw: true,
  });
};

// The hook returns AttendanceSession | null — null means "not marked
// yet for this date/type", which is a normal state, not an error.
export const useGetRegister = (
  sectionId: string,
  termId: string,
  params: GetRegisterParams = {},
  options?: Partial<
    UseQueryOptions<GetRegisterResponse, ServerErrorResponse, AttendanceSession | null>
  >
) => {
  return useQuery<GetRegisterResponse, ServerErrorResponse, AttendanceSession | null>({
    queryKey: attendanceKeys.registerSession(sectionId, termId, params),
    queryFn: () => getRegister(sectionId, termId, params),
    select: (response) => response.data,
    enabled: Boolean(sectionId) && Boolean(termId),
    ...options,
  });
};