import * as z from "zod";

const email = z.email();
const phone = z.string().regex(/^(?:\+234|234|0)(7[0-9]|8[0-9]|9[0-9])\d{8}$/);

export const resetPasswordSchema = z.object({
  identifier: z
    .string()
    .nonempty("This field is required")
    .refine(
      (value) =>
        email.safeParse(value).success || phone.safeParse(value).success,
      {
        message: "Enter a valid email address or phone number",
      }
    ),
});
