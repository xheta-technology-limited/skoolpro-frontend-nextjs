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
  return api.post("students", payload);
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