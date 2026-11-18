import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const addRestrictionSchema = z.object({
  denyable_type: requiredString,
  denyable_id: requiredString,
  permission: requiredString,
  reason: z.string().optional(),
});

export type AddRestrictionFormData = z.infer<typeof addRestrictionSchema>;
