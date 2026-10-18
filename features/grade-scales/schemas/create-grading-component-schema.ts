import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createGradingComponentSchema = z.object({
  name: requiredString,
  assessment_type: z.string().optional(),
  code: z.string().optional(),
  max_score: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return value.trim() !== "" && Number.isFinite(number) && number >= 1;
    }, "Please enter a valid number")
    .optional(),
  weight: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return (
        value.trim() !== "" &&
        Number.isFinite(number) &&
        number >= 1 &&
        number <= 100
      );
    }, "Please enter a valid number between 1 and 100")
    .optional(),
});

export type CreateGradingComponentFormData = z.infer<
  typeof createGradingComponentSchema
>;
