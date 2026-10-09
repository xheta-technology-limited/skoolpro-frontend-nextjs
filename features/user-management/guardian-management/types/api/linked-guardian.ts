export interface LinkedGuardian {
  user_id: string;
  email: string;
  roles: string[];
  must_change_password: boolean;
  is_linked: boolean;
}