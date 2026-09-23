import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ServerErrorResponse } from "@/types/api";
import type { StudentDetail } from "../types/student-detail-types";

export interface UpdateStudentPayload {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  place_of_birth?: string | null;
  nationality?: string | null;
  country_of_birth?: string | null;
  first_language?: string | null;
  other_languages?: string | null;
  religion?: string | null;
  ethnicity?: string | null;
  personal_email?: string | null;
  personal_phone?: string | null;
  home_address?: string | null;
  mailing_address?: string | null;
  current_residential_address?: string | null;
  admission_date?: string;
  admission_type?: string | null;
  previous_school?: string | null;
  reason_for_leaving_previous_school?: string | null;
  entrance_exam_result?: string | null;
  interview_result?: string | null;
}

export const updateStudent = (
  studentId: string,
  payload: UpdateStudentPayload
): Promise<StudentDetail> => {
  return api.put(`students/${studentId}`, payload);
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    StudentDetail,
    ServerErrorResponse,
    { studentId: string; payload: UpdateStudentPayload }
  >({
    mutationFn: ({ studentId, payload }) => updateStudent(studentId, payload),
    onSuccess: (_data, { studentId }) => {
      // Refresh the detail view for this student
      queryClient.invalidateQueries({ queryKey: ["students", studentId] });
      // Refresh any list views
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};