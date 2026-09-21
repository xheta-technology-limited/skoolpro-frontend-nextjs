import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetEffectiveSubjectsResponse } from "../types/effective-subjects-types";

export const getEffectiveSubjects = (
  enrolmentId: string
): Promise<GetEffectiveSubjectsResponse> => {
  return api.get(`enrolments/${enrolmentId}/subjects`);
};

export const useGetEffectiveSubjects = (enrolmentId: string | undefined) => {
  return useQuery({
    queryKey: ["enrolments", enrolmentId, "subjects"],
    queryFn: () => getEffectiveSubjects(enrolmentId as string),
    enabled: Boolean(enrolmentId),
  });
};