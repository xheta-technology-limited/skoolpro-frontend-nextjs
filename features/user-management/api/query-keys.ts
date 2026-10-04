export const templateKeys = {
  all: ["template"] as const,
  detail: (ent: string) => ["template", ent] as const,
};

export const countKeys = {
  all: ["count", "people"] as const,
};
export const importKeys = {
  all: ["imports"] as const,
  detail: (jobID: string) => ["imports", jobID] as const,
  preview: (jobID: string) => ["preview", jobID] as const,
  errors: (jobID: string) => ["errors", jobID] as const,
};
