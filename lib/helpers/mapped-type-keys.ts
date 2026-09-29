export function typedMappedKeys<T extends object>(obj: T): (keyof T & string)[] {
  return Object.keys(obj) as (keyof T & string)[];
}
