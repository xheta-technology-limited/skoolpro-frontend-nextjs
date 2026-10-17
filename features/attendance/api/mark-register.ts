import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { attendanceKeys } from "./query-keys";
import type {
  AttendanceSession,
  MarkRegisterPayload,
} from "../types/attendance-register-types";

interface MarkRegisterArgs {
  sectionId: string;
  termId: string;
  payload: MarkRegisterPayload;
}

// Confirmed: POST /class-sections/{section}/register/{term} (200 — the
// session with its records). 422 cases: student not enrolled in the
// class, a status that requires a reason or a supporting document
// without one, and "lesson" sessions needing the timetable module. The
// server's message arrives as the error's `message`.
//
// Per the spec, a successful mark also recomputes escalation flags and
// raises guardian notifications server-side — no extra call needed.
export const markRegister = ({
  sectionId,
  termId,
  payload,
}: MarkRegisterArgs): Promise<AttendanceSession> => {
  return api.post(`class-sections/${sectionId}/register/${termId}`, payload);
};

export const useMarkRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<AttendanceSession, ServerErrorResponse, MarkRegisterArgs>({
    mutationFn: markRegister,
    // Marking changes the register itself and every student's summary
    // (the single-student summaries aren't under the register key), so
    // refresh both.
    onSuccess: (_data, { sectionId, termId }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.register(sectionId, termId),
        }),
        queryClient.invalidateQueries({
          queryKey: attendanceKeys.enrolmentSummaries(),
        }),
      ]),
  });
};