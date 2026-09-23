import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import type {
  CreateStudentPayload,
  CreateStudentResponse,
} from "../types/create-student-types";

export const createStudent = (
  payload: CreateStudentPayload
): Promise<CreateStudentResponse> => {
  // `raw: true` is required here — the api client's default behavior
  // auto-unwraps every response to just `.data`, which silently drops
  // `meta` (meta.enrolled/meta.enrolment_id/meta.over_capacity) on
  // every single request, always, regardless of what the backend
  // sends. Without this, response.meta is undefined at runtime even
  // though the server genuinely returns it (confirmed via a real
  // logged response). See src/lib/api.ts's `raw` option.
  return api.post("students", payload, { raw: true });
};

export const useCreateStudent = () => {
  return useMutation<
    CreateStudentResponse,
    ServerErrorResponse,
    CreateStudentPayload
  >({
    mutationFn: createStudent,
  });
};