import type { TangoEvent } from './portfolio';

export function currentDfwMonth(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(now);
  return {
    year: Number(parts.find((part) => part.type === 'year')!.value),
    month: Number(parts.find((part) => part.type === 'month')!.value) - 1,
  };
}
export function monthTitle(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month, 1)));
}
export function calendarDays(
  year: number,
  month: number,
): ({ date: string; day: number } | null)[] {
  const start = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const prefix = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`;
  const result: ({ date: string; day: number } | null)[] = Array.from(
    { length: start.getUTCDay() },
    () => null,
  );
  for (let day = 1; day <= days; day++)
    result.push({ date: `${prefix}-${String(day).padStart(2, '0')}`, day });
  while (result.length % 7) result.push(null);
  return result;
}
export function eventsForMonth(
  events: readonly TangoEvent[],
  year: number,
  month: number,
): TangoEvent[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return events
    .filter((event) => event.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));
}
export function validEventDate(date: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(`${date}T12:00:00Z`)) &&
    new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date
  );
}
