export type AuthenticatorSetupResponse = {
  secret: string;
  qr_code_url: string;
};

export type AuthenticatorConfirmResponse = {
  message: string;
};
