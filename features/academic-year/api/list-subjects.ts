import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { schoolSubjectKeys } from "./query-keys";
import { Subject } from "../types/api/subjects";

export type ListSubjectParams = {
  department?: string;
  stage?: string;
};
export const listSubjects = (
  params?: ListSubjectParams
): Promise<Subject[]> => {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
  }
  const query = searchParams.toString();
  return api.get(`subjects${query ? `?${query}` : ""}`);
};

export const useListSubjects = (
  params?: ListSubjectParams,
  options?: Partial<UseQueryOptions<Subject[], ServerErrorResponse>>
) => {
  return useQuery<Subject[], ServerErrorResponse>({
    queryFn: () => listSubjects(params),
    queryKey:
      params?.department || params?.stage !== undefined
        ? schoolSubjectKeys.filtered(params)
        : schoolSubjectKeys.all,
    ...options,
  });
};
