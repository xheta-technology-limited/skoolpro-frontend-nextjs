export const gradeScaleKeys = {
  all: ["grade-scales"] as const,
  detail: (id: string) => ["grade-scales", id] as const,
};

export const gradingSchemeKeys = {
  all: ["grading-schemes"] as const,
  detail: (id: string) => ["grading-schemes", id] as const,
};

export const passMarkKeys = {
  all: ["pass-marks"] as const,
  detail: (id: string) => ["pass-marks", id] as const,
};

export const promotionRuleKeys = {
  all: ["promotion-rules"] as const,
  detail: (id: string) => ["promotion-rules", id] as const,
};