import { z } from "zod";

const termSchema = z.object({
  name: z.string(),
  starts_on: z.iso.datetime(),
  ends_on: z.iso.datetime(),
});

export const academicYearSchema = z
  .object({
    name: z.string(),
    starts_on: z.iso.datetime(),
    ends_on: z.iso.datetime(),

    session_type: z.enum(["term", "semester"]).optional(),

    // status: z.enum(["upcoming", "current", "archived"]).default("upcoming"),

    is_default_for_enrolment: z.boolean().default(false),

    terms: z.array(termSchema).optional(),
  })
  .refine((data) => data.ends_on >= data.starts_on, {
    message: "ends_on must be greater than or equal to starts_on",
    path: ["ends_on"],
  })
  .refine(
    (data) =>
      !data.terms || data.terms.every((term) => term.ends_on >= term.starts_on),
    {
      message: "Term ends_on must be greater than or equal to starts_on",
      path: ["terms"],
    }
  );
export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
