import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createRoleSchema = z.object({
  name: requiredString,
  permissions: z.array(z.string()),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
