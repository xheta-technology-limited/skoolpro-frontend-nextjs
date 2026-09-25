export const templateKeys = {
  all: ["template"] as const,
  detail: (ent: string) => ["template", ent] as const,
};

export const countKeys = {
  all: ["count", "people"] as const,
};
