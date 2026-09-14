import { z } from "zod";

export const createPayrollSchema = z.object({
  salary_structure: z.string().optional(),

  payment_frequency: z.string().optional(),

  base_salary: z.string().optional(),

  allowances: z.record(z.string(), z.string()).optional(),

  deductions: z.record(z.string(), z.string()).optional(),

  bank_details: z
    .object({
      bank_name: z.string().optional(),
      account_number: z.string().optional(),
    })
    .optional(),

  tax_information: z.record(z.string(), z.string()).optional(), //Idk what this is fr. Figure it out, bro

  pension_information: z.record(z.string(), z.string()).optional(), //Idk what this is fr. Figure it out, bro
});

export type CreatePayrollFormData = z.infer<typeof createPayrollSchema>;
