export type loginForm = {
  login: string;
  password: string;
};

export type MFAMethod = "sms_otp" | "authenticator_app" | "email_otp";
