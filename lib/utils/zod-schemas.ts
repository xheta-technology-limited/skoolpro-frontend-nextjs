import * as z from "zod";

export const requiredString = z.string().nonempty("This field is required");

export const phoneString = z
  .string()
  .nonempty("This field is required")
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number");

export const optionalPhoneString = z
  .string()
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
  .or(z.literal(""));

export const emailString = z
  .string()
  .nonempty("This field is required")
  .email("Enter a valid email");

export const hexColorString = z.string();

type NumericString = {
  optional?: boolean;
  percent?: boolean;
  message?: string;
};

export const numericString = ({ percent, message }: NumericString) => {
  const defaultMessage = percent
    ? "Please enter a valid number between 0 and 100"
    : "Please enter a valid number";

  const isValid = (value: string) => {
    if (value === "") {
      return;
    }
    if (!/^\d+(\.\d+)?$/.test(value.trim())) return false; // plain decimals only
    const n = Number(value);
    return percent ? n >= 0 && n <= 100 : n >= 1;
  };

  const base = z.string().refine(isValid, message ?? defaultMessage);

  return base;
};
