import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { schoolProfileKeys } from "./query-keys";
import { ServerErrorResponse } from "@/types/api";
import { SchoolProfile } from "../types/school-profile";

export const getSchoolProfile = (): Promise<SchoolProfile> => {
  return api.get("/school");
};

export const useGetSchoolProfile = () => {
  return useQuery<SchoolProfile, ServerErrorResponse>({
    queryFn: getSchoolProfile,
    queryKey: schoolProfileKeys.all,
  });
};
