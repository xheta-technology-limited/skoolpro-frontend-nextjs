export function singledOutLetter(str: string): string | null {
  const match = str.match(/(?:^|[ -])([A-Za-z])(?=[ -]|$)/);

  return match?.[1] ?? null;
}
