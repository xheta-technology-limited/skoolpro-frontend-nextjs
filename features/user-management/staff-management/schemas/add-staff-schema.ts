import { phoneString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

export const addStaffFirstSchema = z.object({
  // Required fields
  staff_number: z.string().min(1, "Staff number is required"),

  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  // Optional fields
  title: z.string().optional(),

  middle_name: z.string().optional(),

  national_reg_number: z.string().optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  date_of_birth: z
    .string() // or z.coerce.date() if you're working with Date objects
    .optional(),

  nationality: z.string().optional(),

  marital_status: z.string().optional(),

  email: z.email("Enter a valid email address").optional(),

  phone: phoneString,
  address: z.string().max(255, "Address is too long").optional(),

  emergency_phone_number: z.string(),
});

export type AddStaffFirstFormData = z.infer<typeof addStaffFirstSchema>;

export const addStaffSecondSchema = z.object({
  category: z.string().optional(),

  reporting_manager_id: z.string().optional(),

  employment_type: z.string().optional(),

  employment_start_date: z.string().optional(), // or z.coerce.date()

  department: z.string().optional(),

  contract_type: z.string().optional(),

  staff_status: z.string().optional(),

  campus_id: z.string().optional(),

  payroll_number: z.string().optional(),

  work_location: z.string().optional(),

  probation_end_date: z.string().optional(), // or z.coerce.date()

  contract_end_date: z.string().optional(), // or z.coerce.date()

  working_days: z.array(z.string()).optional(), // e.g. ["monday", "tuesday", ...] if multi-select

  working_hours: z.string().optional(), // e.g. "09:00-17:00"
});

export type AddStaffSecondFormData = z.infer<typeof addStaffSecondSchema>;

export type AddStaffFormData = AddStaffSecondFormData & AddStaffFirstFormData;
