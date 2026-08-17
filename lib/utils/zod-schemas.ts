import * as z from "zod";

export const requiredString = z.string().nonempty("This field is required");

export const phoneString = z
  .string()
  .nonempty("This field is required")
  .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number");

export const emailString = z
  .string()
  .nonempty("This field is required")
  .email("Enter a valid email");

export const hexColorString = z
  .string()
  .nonempty("This field is required")
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Enter a valid hex color code");