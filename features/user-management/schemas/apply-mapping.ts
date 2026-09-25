import { z } from "zod";

export const applyMappingSchema = z.object({
  column_mapping: z.object({
    staff_number: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    category: z.string(),
    middle_name: z.string(),
    title: z.string(),
    gender: z.string(),
    email: z.string(),
    phone: z.string(),
    department: z.string(),
    employment_type: z.string(),
    employment_start_date: z.string(),
    staff_status: z.string(),
    payroll_number: z.string(),
    national_reg_number: z.string(),
  }),
});

export type ApplyMappingFormData = z.infer<typeof applyMappingSchema>;
