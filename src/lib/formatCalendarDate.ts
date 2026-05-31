/** Parsea fechas solo-calendario (p. ej. "1990-07-17") sin desfase por zona horaria. */
export function parseCalendarDate(value: string | Date): Date | null {
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const isUtcMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;

  if (isUtcMidnight) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatCalendarDate(
  value: string | Date | undefined | null,
  locale = "es-ES",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
  fallback = "—"
): string {
  if (!value) return fallback;

  const date = parseCalendarDate(value);
  if (!date) return fallback;

  return date.toLocaleDateString(locale, options);
}
