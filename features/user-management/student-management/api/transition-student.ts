import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  TransitionStudentPayload,
  TransitionStudentResponse,
} from "../types/transition-student-types";

export const transitionStudent = (
  studentId: string,
  payload: TransitionStudentPayload
): Promise<TransitionStudentResponse> => {
  return api.post(`students/${studentId}/transition`, payload);
};

export const useTransitionStudent = (studentId: string) => {
  return useMutation<
    TransitionStudentResponse,
    ServerErrorResponse,
    TransitionStudentPayload
  >({
    mutationFn: (payload) => transitionStudent(studentId, payload),
  });
};