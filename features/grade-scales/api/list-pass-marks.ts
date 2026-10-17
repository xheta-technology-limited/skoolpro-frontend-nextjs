import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { passMarkKeys } from "./query-keys";
import { PassMark } from "../types/api/pass-mark";

export const listPassMarks = (): Promise<PassMark[]> => api.get("pass-marks");

export const useListPassMarks = (
  options?: Partial<UseQueryOptions<PassMark[], ServerErrorResponse>>
) => {
  return useQuery<PassMark[], ServerErrorResponse>({
    queryFn: listPassMarks,
    queryKey: passMarkKeys.all,
    ...options,
  });
};
