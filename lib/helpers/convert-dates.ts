export const isoToLongDate = (isoDate: string) => {
  if (isoDate === "") {
    return "";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
};
