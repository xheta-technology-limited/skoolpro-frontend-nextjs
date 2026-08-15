export type ResetPasswordRequest = {
  login: string;
  code: string;
  password: string;
  password_confirmation: string;
};

export type ForgotPasswordRequest = {
  login: string;
};
