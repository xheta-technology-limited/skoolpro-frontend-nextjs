export function titleCase(word: string | undefined | null) {
  if (!word) {
    return;
  }
  return word.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
