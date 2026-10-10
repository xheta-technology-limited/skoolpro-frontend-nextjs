
export const guardianKeys = {
  all: ["guardians"] as const,
  list: (params: object = {}) => [...guardianKeys.all, params] as const,
  detail: (guardianId: string) => [...guardianKeys.all, guardianId] as const,
  linkedUser: (guardianId: string) =>
    [...guardianKeys.detail(guardianId), "linked-user"] as const,
};