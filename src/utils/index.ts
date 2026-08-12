/**
 * RoadWatch Indonesia — Utility Functions
 *
 * General-purpose helpers.
 */

// Re-export cn from lib/utils (shadcn standard)
export { cn } from '@/lib/utils';

/**
 * Format a date string for display (Indonesian locale).
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a confidence score as percentage.
 */
export function formatConfidence(confidence: number | undefined): string {
  if (confidence === undefined || confidence === null) return 'N/A';
  return `${(confidence * 100).toFixed(0)}%`;
}
