export function formatPermission(text: string): string {
  return text
    .split(".")
    .map((segment) =>
      segment
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" › ");
}
