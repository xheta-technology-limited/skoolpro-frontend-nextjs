import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetStudentResponse } from "../types/student-detail-types";

export const getStudent = (studentId: string): Promise<GetStudentResponse> => {
  return api.get(`students/${studentId}`);
};

export const useGetStudent = (studentId: string) => {
  return useQuery({
    queryKey: ["students", studentId],
    queryFn: () => getStudent(studentId),
    enabled: Boolean(studentId),
  });
};