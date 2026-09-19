import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";

export type CreateStaffLoginData = {
  email: string | undefined;
  roles: string[];
};

export type StaffLoginResponse = {
  user_id: string;
  email: string;
  temporary_password: string;
  must_change_password: boolean;
};

export const createStaffLogin = (
  staffId: string,
  data: CreateStaffLoginData
): Promise<StaffLoginResponse> => {
  return api.post(`staff/${staffId}/login`, data);
};

export const useCreateStaffLogin = (staffId: string) => {
  return useMutation<StaffLoginResponse, ServerErrorResponse, CreateStaffLoginData>({
    mutationFn: (data) => {
      return createStaffLogin(staffId, data);
    },
  });
};