import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formats a date string to Brazilian Portuguese format
 * @param dateString - ISO date string to format
 * @returns Formatted date string in format "DD/MM/YYYY, HH:mm"
 * @example
 * formatDate("2024-01-15T10:30:00Z")
 * // Returns "15/01/2024, 10:30"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy, HH:mm", { locale: ptBR });
}

/**
 * Calculates and returns a human-readable time ago string in Portuguese
 * @param dateString - ISO date string to calculate time difference from
 * @returns Human-readable time ago string (e.g., "há 5 minutos", "há 2 horas")
 * @example
 * getTimeAgo("2024-01-15T10:30:00Z")
 * // Returns "há 5 minutos" (if current time is 10:35)
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
}
