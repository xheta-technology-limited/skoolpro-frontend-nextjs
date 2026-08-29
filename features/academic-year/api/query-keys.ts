export const authKeys = {
  all: ["academic-year"] as const,
  detail: (id: string) => ["academic-year", id] as const,
};
