import { z } from "zod";

export const createBandSchema = z.object({
  label: z.string(),
  min_score: z.number(),
  max_score: z.number(),
  grade_point: z.number().optional(),
  description: z.string().optional(),
  comment: z.string().optional(),
  is_pass: z.boolean().optional(),
});

export type CreateBandFormData = z.infer<typeof createBandSchema>;
