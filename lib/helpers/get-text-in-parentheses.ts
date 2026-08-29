export const splitAtSlash = (value: string): string[] => {
  const match = value.match(/\(([^)]*)\)/);

  if (!match) return [];

  return match[1].split("/");
};

export const getTextInParentheses = (value: string): string[] => {
  const match = value.match(/\(([^)]*)\)/);

  if (!match) return [];

  return match;
};
