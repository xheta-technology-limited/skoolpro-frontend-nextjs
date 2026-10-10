
export interface ProvisionGuardianLoginPayload {
  email?: string;
  roles: string[];
}

export interface ProvisionGuardianLoginData {
  user_id: string;
  email: string;
  // Shown ONCE — the server won't return it again.
  temporary_password: string;
  must_change_password: boolean;
}

export interface ProvisionGuardianLoginResponse {
  data: ProvisionGuardianLoginData;
  message: string;
}