// src/app/utils/date-utils.ts
import { format, parse, parseISO } from 'date-fns';

export function formatDateString(dateString: string): string {
  return format(parse(dateString, "EEE MMM dd HH:mm:ss 'IST' yyyy", new Date()), 'MMM d, yyyy');
}

export function dateISOToFormatDataString(dateString: string): string{
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export function dateISOToFormatString(dateString: string): string{
  return format(parseISO(dateString), 'MM/dd/yy');
}