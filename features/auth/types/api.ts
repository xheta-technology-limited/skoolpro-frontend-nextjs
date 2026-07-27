import { ISODateString } from "@/types/api";

export interface LoginRequest {
  login: string;
  password: string;
}

export type LoginResponse = LoginData | MfaChallengeResponse;

export type LoginData = {
  id: string;
  username: string;
  email: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  phone: string | null;
  profile_image: string | null;

  dob: string | null;
  gender: string | null;
  blood_group: string | null;
  marital_status: string | null;
  nationality: string | null;
  religion: string | null;

  status: "active" | "inactive" | string;
  timezone: string;

  active_role: string;
  active_school_id: string | null;

  is_staff: 0 | 1;
  account_activated: 0 | 1;
  mfa_enabled: boolean;
  must_change_password: boolean;

  email_verified_at: string | null;
  password_changed_at: string | null;

  login_count: number;
  failed_login_attempts: number;
  last_login_at: string | null;
  last_failed_login_at: string | null;
  locked_until: string | null;

  created_at: ISODateString;
  updated_at: ISODateString;
  deleted_at: ISODateString | null;

  created_by: string | null;
  modified_by: string | null;
};

export type MfaChallengeResponse = {
  mfa_required: boolean;
  challenge_id: string;
  available_methods: ("authenticator_app" | "sms_otp")[];
};
