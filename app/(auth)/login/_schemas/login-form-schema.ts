import * as z from "zod";

export const userSchema = z.object({
  email: z.string().nonempty("This field is required"),
  password: z.string().nonempty("This field is required"),
});
