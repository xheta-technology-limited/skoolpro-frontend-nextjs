
export interface ResetGuardianPasswordResponse {
  data: {
    temporary_password: string;
    user_id?: string;
    email?: string;
    must_change_password?: boolean;
  };
  message?: string;
}