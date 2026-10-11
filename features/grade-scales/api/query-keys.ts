export const gradeScaleKeys = {
  all: ["grade-scales"] as const,
  detail: (id: string) => ["grade-scales", id] as const,
};