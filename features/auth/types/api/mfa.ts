export type AuthenticatorSetupResponse = {
  secret: string;
  qr_code_url: string;
};

export type AuthenticatorConfirmResponse = {
  message: string;
};

type method = "authenticator_app" | "sms_otp";
export type VerifyMfaResponse = {
  challenge_id: string;
  available_methods: method[];
  code: string;
};

export type VerifyMfaRequest = {
  challenge_id: string;
  method: method;
  code: string;
};
