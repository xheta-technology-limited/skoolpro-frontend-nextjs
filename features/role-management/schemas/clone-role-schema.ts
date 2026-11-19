import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const cloneRoleSchema = z.object({
  name: requiredString,
});

export type CloneRoleFormData = z.infer<typeof cloneRoleSchema>;

export const cloneRoleFormSchema = cloneRoleSchema.extend({
  role_id: requiredString,
});

export type CloneRoleModalFormData = z.infer<typeof cloneRoleFormSchema>;
