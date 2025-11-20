import { format } from "date-fns";
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
