import { z } from "zod";

export const qualificationSchema = z.object({
  type: z.string().nonempty("Please select a qualification type"),
  qualification: z.string().min(1, "Qualification is required"),
  institution: z.string().optional(),
  grade: z.string().optional(),
  professional_registration: z.string().optional(),
  award_date: z.iso.datetime().optional(),
  expiry_date: z.iso.datetime().optional(),
});

export type QualificationFormData = z.infer<typeof qualificationSchema>;
