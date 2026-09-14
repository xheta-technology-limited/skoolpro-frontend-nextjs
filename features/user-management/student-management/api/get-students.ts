import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type {
  GetStudentsParams,
  GetStudentsResponse,
} from "../types/student-types";

export const getStudents = (
  params: GetStudentsParams = {}
): Promise<GetStudentsResponse> => {
  return api.get("students", { params });
};

export const useGetStudents = (params: GetStudentsParams = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
};