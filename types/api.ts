export type ISODateString = string;

export type ServerErrorResponse = {
  message: string;
  errors?: Record<string, unknown>;
};
