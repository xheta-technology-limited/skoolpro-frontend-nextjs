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
};
export const numericString = ({ optional, percent }: NumericString) => {
  if (optional && percent) {
    return z
      .string()
      .refine((value) => {
        const number = Number(value);
        return (
          value.trim() !== "" &&
          Number.isFinite(number) &&
          number >= 0 &&
          number <= 100
        );
      }, "Please enter a valid number between 0 and 100")
      .optional();
  } else if (optional && !percent) {
    return z
      .string()
      .refine((value) => {
        const number = Number(value);
        return value.trim() !== "" && Number.isFinite(number) && number >= 1;
      }, "Please enter a valid number")
      .optional();
  } else if (!optional && percent) {
    return z.string().refine((value) => {
      const number = Number(value);
      return (
        value.trim() !== "" &&
        Number.isFinite(number) &&
        number >= 0 &&
        number <= 100
      );
    }, "Please enter a valid number between 0 and 100");
  } else {
    return z.string().refine((value) => {
      const number = Number(value);
      return value.trim() !== "" && Number.isFinite(number) && number >= 1;
    }, "Please enter a valid number");
  }
};
