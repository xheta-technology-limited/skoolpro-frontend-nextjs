import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const createArmSchema = z.object({
  name: requiredString,
  code: z.string().optional(),
  campus_id: z.string().optional(),
  staff_id: z.string().optional(),
  capacity: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return value.trim() !== "" && Number.isFinite(number) && number >= 1;
    }, "Please enter a valid number")
    .optional(),
  arm_sequence: z
    .string()
    .refine((value) => {
      const number = Number(value);
      return value.trim() !== "" && Number.isFinite(number);
    }, "Please enter a valid number")
    .optional(),
  is_active: z.union([z.string(), z.boolean()]).optional(),
});

export type CreateArmFormData = z.infer<typeof createArmSchema>;
