import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { schoolSubjectKeys } from "./query-keys";
import { Subject } from "../types/api/subjects";

export const listSubjects = (department?: string): Promise<Subject[]> => {
  const queryKey = department ? `?department=${department}` : "";
  return api.get(`subjects${queryKey}`);
};

export const useListSubjects = (
  department?: string,
  options?: Partial<UseQueryOptions<Subject[], ServerErrorResponse>>
) => {
  return useQuery<Subject[], ServerErrorResponse>({
    queryFn: () => listSubjects(department),
    queryKey: department
      ? schoolSubjectKeys.detail(department)
      : schoolSubjectKeys.all,
    ...options,
  });
};
