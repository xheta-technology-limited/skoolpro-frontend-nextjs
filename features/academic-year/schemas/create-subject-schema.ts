import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string(),
  code: z.string().optional(),
  description: z.string().optional(),
  department: z.string().optional(),
  is_active: z.boolean().optional(),
  intended_stage_ids: z.array(z.string()).optional(),
});

export type CreateSubjectRequest = z.infer<typeof createSubjectSchema>;
