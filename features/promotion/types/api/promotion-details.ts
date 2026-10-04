export type PromotionDisposition = "promote" | "graduate" | "repeat" | "hold";

export type PromotionDetails = {
  student_id: string;
  student_name: string;
  admission_number: string;
  source_enrolment_id: string;
  current_level: string;
  current_section: string;
  disposition: PromotionDisposition;
  target_level: string;
  target_section_id: string | null;
  target_section: string | null;
  needs_placement: boolean;
  note: string | null;
};