export interface loginResponse {
  id: string;
  name: string;
  email: string;
}

export interface loginRequest {
  email: string;
  password: string;
}
