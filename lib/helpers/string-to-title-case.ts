export function titleCase(word: string) {
  return word.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
