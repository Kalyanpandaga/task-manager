import { format } from "date-fns";

export function getTodayLocal() {
  return format(new Date(), "yyyy-MM-dd");
}

export function toUTCDateString(localDate) {
  if (!localDate) return "";
  // Treat localDate as local time at end of day
  const localEndOfDay = new Date(`${localDate}T23:59:59`);
  return localEndOfDay.toISOString();
}

export function toLocalInputValue(utcISOString) {
  if (!utcISOString) return "";
  const d = new Date(utcISOString);
  // Get local date string in yyyy-MM-dd format
  return format(d, "yyyy-MM-dd");
}

export function formatDeadline(utcISOString) {
  if (!utcISOString) return "No date";
  const d = new Date(utcISOString);
  // Format as dd MMM, yyyy in local time
  return format(d, "dd MMM, yyyy");
}
