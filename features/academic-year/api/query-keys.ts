export const academicYearKeys = {
  all: ["academic-year"] as const,
  detail: (id: string) => ["academic-year", id] as const,
};

export const presetKeys = {
  all: ["education-presets"] as const,
  detail: (id: string) => ["education-presets", id] as const,
};
