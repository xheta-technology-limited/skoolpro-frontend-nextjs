import { z } from "zod";
import { createPayrollSchema } from "./add-payroll";

export const editPayrollSchema = createPayrollSchema.partial();

export type EditPayrollFormData = z.infer<typeof editPayrollSchema>;
