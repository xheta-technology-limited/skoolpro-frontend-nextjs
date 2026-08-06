import * as z from "zod";

export const userSchema = z.object({
  login: z.string().nonempty("This field is required"),
  password: z.string().nonempty("This field is required"),
});
export type LoginFormData = z.infer<typeof userSchema>;
