export const commentKeys = {
  all: ["comments"] as const,
  filtered: (type: string, educationLevelId: string) =>
    ["comments", "filtered", type, educationLevelId] as const,
};
