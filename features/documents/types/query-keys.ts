
export const documentKeys = {
  all: ["documents"] as const,
  types: () => [...documentKeys.all, "types"] as const,
  reviewQueue: (params: object = {}) =>
    [...documentKeys.all, "review-queue", params] as const,
  reviews: (documentId: string) =>
    [...documentKeys.all, "reviews", documentId] as const,
  signatures: (documentId: string) =>
    [...documentKeys.all, "signatures", documentId] as const,
  signatureIntegrity: (documentId: string, signatureId: string) =>
    [...documentKeys.signatures(documentId), signatureId, "integrity"] as const,
  owner: (type: string, id: string) =>
    [...documentKeys.all, type, id] as const,
  list: (type: string, id: string, params: object = {}) =>
    [...documentKeys.owner(type, id), params] as const,
};