export const validateRequiredText = (
  value: string,
): string => {
  if (!value.trim()) {
    return value.length
      ? "The field cannot contain only spaces"
      : "The field cannot be empty";
  }

  return "";
};