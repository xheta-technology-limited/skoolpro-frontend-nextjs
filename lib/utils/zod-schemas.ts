import * as z from "zod";

export const requiredString = z.string().nonempty("This field is required");

export const phoneString = z
  .string()
  .nonempty("This field is required")
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number");