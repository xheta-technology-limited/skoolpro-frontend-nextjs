import { z } from "zod";

export const editTeacherSchema = z.object({
  teacher_registration_number: z.string().optional(),

  form_class_section_id: z.uuid().optional(),

  max_teaching_load: z.string().optional(),

  specialist_skills: z.string().optional(),
  curriculum_experience: z.string().optional(),

  subject_ids: z.array(z.uuid()).optional(), // We might have to change this to an array of strings, idk

  section_ids: z.array(z.uuid()).optional(),
});

export type EditTeacherFormData = z.infer<typeof editTeacherSchema>;
