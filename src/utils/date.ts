import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Type definitions
export type DateInput = string | Date | number | dayjs.Dayjs;
export type TimeUnit = 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second';

/**
 * Format a date using dayjs
 * @param date - The date to format
 * @param format - The format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDate = (date: DateInput, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param date - The date to compare to now
 * @returns Relative time string
 */
export const fromNow = (date: DateInput): string => {
  return dayjs(date).fromNow();
};

/**
 * Check if a date is before another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @returns True if date is before compareDate
 */
export const isBefore = (date: DateInput, compareDate: DateInput): boolean => {
  return dayjs(date).isBefore(dayjs(compareDate));
};

/**
 * Check if a date is after another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @returns True if date is after compareDate
 */
export const isAfter = (date: DateInput, compareDate: DateInput): boolean => {
  return dayjs(date).isAfter(dayjs(compareDate));
};

/**
 * Add time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit (day, month, year, etc.)
 * @returns New date in ISO format
 */
export const addTime = (date: DateInput, amount: number, unit: TimeUnit): string => {
  return dayjs(date).add(amount, unit).toISOString();
};

/**
 * Subtract time from a date
 * @param date - The base date
 * @param amount - The amount to subtract
 * @param unit - The unit (day, month, year, etc.)
 * @returns New date in ISO format
 */
export const subtractTime = (date: DateInput, amount: number, unit: TimeUnit): string => {
  return dayjs(date).subtract(amount, unit).toISOString();
};

/**
 * Convert a date to a specific timezone
 * @param date - The date to convert
 * @param timezone - The timezone to convert to
 * @returns Timezone-adjusted date in ISO format
 */
export const toTimezone = (date: DateInput, timezone: string): string => {
  return dayjs(date).tz(timezone).toISOString();
};

/**
 * Get the difference between two dates in the specified unit
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit to measure difference in
 * @returns Difference in specified units
 */
export const diff = (date1: DateInput, date2: DateInput, unit: TimeUnit): number => {
  return dayjs(date1).diff(dayjs(date2), unit);
};

/**
 * Check if a date is between two other dates
 * @param date - Date to check
 * @param startDate - Start of range
 * @param endDate - End of range
 * @param inclusivity - Inclusivity of the range (default: '[]', both inclusive)
 * @returns True if date is between startDate and endDate
 */
export const isBetween = (
  date: DateInput, 
  startDate: DateInput, 
  endDate: DateInput, 
  inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
): boolean => {
  const d = dayjs(date);
  return d.isAfter(dayjs(startDate)) && d.isBefore(dayjs(endDate));
};

/**
 * Sort an array of objects by published_at date in descending order (newest first)
 * @param data - Array of objects containing published_at property
 * @returns Sorted array
 */
export function sortByPublishedAt<T extends { published_at: string }>(
  data: T[]
): T[] {
  return [...data].sort(
    (a, b) => dayjs(b.published_at).valueOf() - dayjs(a.published_at).valueOf()
  );
}

/**
 * Generic sort function for any date property
 * @param data - Array of objects
 * @param dateProperty - Name of the date property to sort by
 * @param order - Sort order ('desc' for newest first, 'asc' for oldest first)
 * @returns Sorted array
 */
export function sortByDate<T extends Record<K, string | Date>, K extends keyof T>(
  data: T[],
  dateProperty: K,
  order: 'desc' | 'asc' = 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const multiplier = order === 'desc' ? -1 : 1;
    return multiplier * (dayjs(a[dateProperty]).valueOf() - dayjs(b[dateProperty]).valueOf());
  });
}

/**
 * Get a date from N days ago
 * @param days - Number of days to go back (default: 7)
 * @param format - Output format (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function getDateFromDaysAgo(days: number = 7, format: string = 'YYYY-MM-DD'): string {
  return dayjs().subtract(days, 'day').format(format);
}

/**
 * Get recent date (7 days ago by default)
 * @returns Date string in YYYY-MM-DD format
 * @deprecated Use getDateFromDaysAgo instead
 */
export const getRecentDate = (): string => {
  return getDateFromDaysAgo(7);
};


// Export the dayjs instance for direct access
export { dayjs };

