import { z } from "zod";

export const createGradingSchemeSchema = z
  .object({
    name: z.string(),
    scope_type: z.enum(["school", "level", "subject_assignment"]),
    education_level_id: z.uuid().optional(),
    subject_level_assignment_id: z.uuid().optional(),
    academic_term_id: z.uuid().optional().nullable(),
    grade_scale_id: z.uuid().optional().nullable(),
    weights_total: z
      .string()
      .refine((value) => {
        const number = Number(value);
        return value.trim() !== "" && Number.isFinite(number) && number >= 1;
      }, "Please enter a valid number")
      .optional(),
    weights_override: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope_type === "level" && !data.education_level_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_level_id"],
        message: "education_level_id is required when scope_type is 'level'",
      });
    }

    if (
      data.scope_type === "subject_assignment" &&
      !data.subject_level_assignment_id
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["subject_level_assignment_id"],
        message:
          "subject_level_assignment_id is required when scope_type is 'subject_assignment'",
      });
    }
  });

export type CreateGradingSchemeFormData = z.infer<
  typeof createGradingSchemeSchema
>;
