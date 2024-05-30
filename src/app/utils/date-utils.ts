// src/app/utils/date-utils.ts
import { format } from 'date-fns';

export function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}
