import { requiredString } from "@/lib/utils/zod-schemas";
import { z } from "zod";

const termSchema = z.object({
  name: z.string(),
  starts_on: z.iso.datetime("Please enter a valid date"),
  ends_on: z.iso.datetime("Please enter a valid date"),
});

export const academicYearSchema = z
  .object({
    name: requiredString,
    starts_on: z.iso.datetime("Please enter a valid date"),
    ends_on: z.iso.datetime("Please enter a valid date"),

    session_type: z.enum(["term", "semester"]).optional(),

    // status: z.enum(["upcoming", "current", "archived"]).default("upcoming"),

    //is_default_for_enrolment: z.boolean().default(false),

    terms: z.array(termSchema).optional(),
  })
  .refine((data) => data.ends_on >= data.starts_on, {
    message: "End date must be greater than or equal to start date",
    path: ["ends_on"],
  })
  .refine(
    (data) =>
      !data.terms || data.terms.every((term) => term.ends_on >= term.starts_on),
    {
      message: "Term end date must be greater than or equal to start date",
      path: ["terms"],
    }
  );
export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
