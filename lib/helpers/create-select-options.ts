import { titleCase } from "./string-to-title-case";

export default function createSelectOptions<
  T extends object,
  K extends keyof T
>(items: T[] | undefined, key: K) {
  if (!items) {
    return;
  }
  if (items.length === 0) {
    return;
  }
  return items.map((item) => ({
    value: item[key],
    label: titleCase(String(item[key])),
  }));
}
