import { titleCase } from "./string-to-title-case";

export default function createSelectOptions<
  T extends object,
  K extends keyof T,
  V extends keyof T
>(items: T[] | undefined, value: K, label: V) {
  if (!items) {
    return;
  }
  if (items.length === 0) {
    return;
  }
  return items.map((item) => ({
    value: item[value],
    label: titleCase(String(item[label])),
  }));
}
