import { z } from "zod";

export const editGuardianSchema = z
  .object({
    title: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    occupation: z.string().optional(),
    employer: z.string().optional(),
    phone: z.string().optional(),
    alt_phone: z.string().optional(),
    email: z
      .string()
      .email("Enter a valid email address")
      .optional()
      .or(z.literal("")),
    preferred_contact_method: z.string().optional(),
    home_address: z.string().optional(),
    work_address: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.email && !values.phone) {
      const message =
        "A guardian must have at least one contact method — an email or a phone number.";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["phone"],
      });
    }
  });

export type EditGuardianFormData = z.infer<typeof editGuardianSchema>;