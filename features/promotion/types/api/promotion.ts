export type PromotionStatus = "prepared" | "committed" | "discarded";

export type PromotionCounts = {
  promoted: number;
  graduated: number;
  repeated: number;
  held: number;
};

export type PromotionYearSummary = {
  id: string;
  name: string;
};

export type Promotion = {
  id: string;
  school_id: string;
  source_academic_year_id: string;
  target_academic_year_id: string;
  status: PromotionStatus;
  counts: PromotionCounts;
  prepared_at: string | null;
  committed_at: string | null;
  source_year: PromotionYearSummary;
  target_year: PromotionYearSummary;
  created_at: string;
  updated_at: string;
};
