import * as z from "zod";
import { requiredString } from "@/lib/utils/zod-schemas";

export const userSchema = z.object({
  login: requiredString,
  password: requiredString,
});
export type LoginFormData = z.infer<typeof userSchema>;
