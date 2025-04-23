# @ted2xmen/utils

A fully type-safe utility package for React applications with date manipulation functions powered by dayjs.

## Installation

```bash
npm install @ted2xmen/utils
# or
yarn add @ted2xmen/utils
```

## Usage

```typescript
import { formatDate, fromNow, addTime } from '@ted2xmen/utils';

// Format a date
const formattedDate = formatDate(new Date(), 'DD/MM/YYYY');
console.log(formattedDate); // e.g., "23/04/2025"

// Get relative time
const relativeTime = fromNow('2025-04-20');
console.log(relativeTime); // e.g., "3 days ago"

// Add time to a date
const futureDate = addTime(new Date(), 2, 'week');
console.log(futureDate); // ISO string of date 2 weeks from now
```

## Available Functions

- `formatDate(date: DateInput, format?: string): string` - Format a date using dayjs
- `fromNow(date: DateInput): string` - Get relative time (e.g., "2 hours ago")
- `isBefore(date: DateInput, compareDate: DateInput): boolean` - Check if a date is before another date
- `isAfter(date: DateInput, compareDate: DateInput): boolean` - Check if a date is after another date
- `addTime(date: DateInput, amount: number, unit: TimeUnit): string` - Add time to a date
- `subtractTime(date: DateInput, amount: number, unit: TimeUnit): string` - Subtract time from a date
- `toTimezone(date: DateInput, timezone: string): string` - Convert a date to a specific timezone
- `diff(date1: DateInput, date2: DateInput, unit: TimeUnit): number` - Get the difference between two dates
- `isBetween(date: DateInput, startDate: DateInput, endDate: DateInput, inclusivity?: string): boolean` - Check if a date is between two other dates
- `dayjs` - Direct access to the dayjs instance with plugins initialized

## Types

```typescript
type DateInput = string | Date | number | dayjs.Dayjs;
type TimeUnit = 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second';
```

## License

MIT
