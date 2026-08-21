export const getSpinnerColor = (variant: string | undefined) => {
  var spinnerColor;
  if (variant === "primary") {
    spinnerColor = "#fafafa";
  } else if (variant === "secondary") {
    spinnerColor = "#010081";
  } else if (variant === "tertiary") {
    spinnerColor = "#010081";
  } else {
    spinnerColor = "#fafafa";
  }
  return spinnerColor;
};
export const getSpinnerSize = (size: string | undefined) => {
  var spinnerSize;
  if (size === "sm" || size === "md") {
    spinnerSize = 16;
  }
  if (size === "lg" || size === undefined) {
    spinnerSize = 24;
  }
  return spinnerSize;
};
