import { MFAMethod } from "../types";

export type AuthenticatorSetupResponse = {
  secret: string;
  qr_code_url: string;
};

export type AuthenticatorConfirmResponse = {
  message: string;
};

export type VerifyMfaResponse = {
  challenge_id: string;
  available_methods: MFAMethod[];
  code: string;
};

export type VerifyMfaRequest = {
  challenge_id: string;
  method: MFAMethod;
  code: string;
};
