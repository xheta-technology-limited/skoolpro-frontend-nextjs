import { AxiosError } from "axios";

export type ServerErrorResponse = {
  message: string;
  errors?: any;
};
