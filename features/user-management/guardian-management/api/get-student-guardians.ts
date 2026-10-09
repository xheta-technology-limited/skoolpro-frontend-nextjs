import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetStudentGuardiansResponse } from "../types/get-student-guardians-types";

// Confirmed: GET /students/{student}/guardians.
export const getStudentGuardians = (
  studentId: string
): Promise<GetStudentGuardiansResponse> => {
  return api.get(`students/${studentId}/guardians`);
};

// Deliberately its own query key — ["students", studentId, "guardians"]
// — distinct from the main student query (["students", studentId]
// used by useGetStudent). This lets a caller invalidate/refetch just
// the guardians list (e.g. right after linking a new guardian via
// attach-guardian) without needing to refetch the whole student
// record through the main endpoint.
export const useGetStudentGuardians = (studentId: string) => {
  return useQuery({
    queryKey: ["students", studentId, "guardians"],
    queryFn: () => getStudentGuardians(studentId),
    enabled: Boolean(studentId),
  });
};