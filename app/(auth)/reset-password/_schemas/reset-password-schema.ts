import * as z from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .nonempty("This field is required"),
});
