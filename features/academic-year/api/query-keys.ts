export const academicYearKeys = {
  all: ["academic-year"] as const,
  detail: (id: string) => ["academic-year", id] as const,
};

export const presetKeys = {
  all: ["education-presets"] as const,
  detail: (id: string) => ["education-presets", id] as const,
};

export const levelKeys = {
  all: ["education-level"] as const,
  detail: (id: string) => ["education-level", id] as const,
};

export const armKeys = {
  all: ["level-arms"] as const,
  detail: (id: string) => ["level-arms", id] as const,
};

export const educationStageKeys = {
  all: ["education-stage"] as const,
  detail: (id: string) => ["education-stage", id] as const,
};

export const schoolSubjectKeys = {
  all: ["school-subjects"] as const,
  detail: (id: string) => ["school-subjects", id] as const,
};
