export const generateFormDate = (dateStr: string): string =>
  dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
