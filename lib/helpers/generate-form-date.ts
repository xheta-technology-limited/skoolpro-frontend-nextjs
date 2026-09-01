export const generateFormDate = (dateStr: string): string => {
  if (dateStr.includes("T")) return dateStr;
  return new Date(`${dateStr}T00:00:00`).toISOString();
};
