export type CommentBankEntry = {
  id: string;
  type: string;
  education_level_id: string | null;
  min_score: number;
  max_score: number;
  body: string;
  is_active: boolean;
  sequence: number;
};
