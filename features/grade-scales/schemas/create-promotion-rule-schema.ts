import { numericString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

const optionalNumericString = z
  .string()
  .refine((value) => {
    if (value.trim() === "") return true;
    return Number.isFinite(Number(value));
  }, "Please enter a valid number")
  .optional();

export const createPromotionRuleSchema = z
  .object({
    scope: z
      .enum(["school", "stage", "level"], "This field is required")
      .nonoptional("This field is required"),
    education_stage_id: z.string().optional(),
    education_level_id: z.string().optional(),
    minimum_average: numericString({ optional: true, percent: true }),
    require_all_compulsory: z.boolean().optional(),
    required_subject_assignment_ids: z.array(z.string()).optional(),
    attendance_requirement: numericString({ optional: true, percent: true }),
    auto_promote: z.boolean().optional(),
    graduation_minimum_average: optionalNumericString,
  })
  .superRefine((data, ctx) => {
    if (data.scope === "stage" && !data.education_stage_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_stage_id"],
        message: "Education stage is required when scope is 'stage'",
      });
    }

    if (data.scope === "level" && !data.education_level_id) {
      ctx.addIssue({
        code: "custom",
        path: ["education_level_id"],
        message: "Education level is required when scope is 'level'",
      });
    }
  });

export type CreatePromotionRuleFormData = z.infer<
  typeof createPromotionRuleSchema
>;
