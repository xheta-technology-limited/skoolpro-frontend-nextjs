import * as z from "zod";

export const userSchema = z.object({
  email: z.string().nonempty("This field is required"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/,
      "Must contain a special character"
    ),
});
