/**
 * Safely formats a date string for display.
 * Returns "N/A" if the value is null, undefined, or produces an invalid date.
 */
export const formatDate = (
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", options);
};

/**
 * Formats a date string with time included.
 */
export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-IN");
};
