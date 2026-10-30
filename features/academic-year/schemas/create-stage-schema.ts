import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createStageSchema = z.object({
  name: requiredString,
  code: z.string().optional(),
  sequence: z.coerce.number().int().min(1).optional(),
  school_type_id: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateStageFormData = z.infer<typeof createStageSchema>;
