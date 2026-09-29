export function flipKeyValuePair(obj: any): Record<string, string> {
  const fObj = obj as Record<string, string>;
  const result: Record<string, string> = {};
  Object.entries(fObj).forEach(([key, value]) => {
    result[value] = key;
  });

  return result;
}
