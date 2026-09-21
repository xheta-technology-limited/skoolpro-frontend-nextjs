import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type {
  GetEnrolmentsParams,
  GetEnrolmentsResponse,
} from "../types/enrolment-types";

export const getEnrolments = (
  params: GetEnrolmentsParams
): Promise<GetEnrolmentsResponse> => {
  return api.get("enrolments", { params });
};

export const useGetEnrolments = (params: GetEnrolmentsParams) => {
  return useQuery({
    queryKey: ["enrolments", params],
    queryFn: () => getEnrolments(params),
  });
};