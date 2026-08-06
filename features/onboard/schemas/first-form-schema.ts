import * as z from "zod";

export const firstFormSchema = z.object({
  school_name: z.string().nonempty("This field is required"),
  display_name: z.string().nonempty("This field is required"),
  registration_number: z.string().nonempty("This field is required"),
  country: z.string().nonempty("This field is required"),
  authority: z.string().nonempty("This field is required"),
  expiry_date: z.string().nonempty("This field is required"),
  file: z.file().nonoptional("This field is required"),
});
export type FirstFormData = z.infer<typeof firstFormSchema>;
