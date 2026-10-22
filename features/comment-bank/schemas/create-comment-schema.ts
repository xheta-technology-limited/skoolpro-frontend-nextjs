import { numericString, requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createCommentSchema = z
  .object({
    type: z.enum([
      "subject_teacher",
      "form_teacher",
      "head_teacher",
      "principal",
    ]),
    education_level_id: z.string().optional(),
    min_score: numericString({ percent: true }),
    max_score: numericString({ percent: true }),
    body: requiredString,
    sequence: numericString({}).optional(),
  })
  .refine((data) => data.max_score >= data.min_score, {
    message: "Maximum score must be greater than or equal to minimum score",
    path: ["max_score"],
  });

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
