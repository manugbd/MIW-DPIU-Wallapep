export const DISPLAY_LOCALE = "en-GB";

export const CURRENCY = "EUR";

const money = new Intl.NumberFormat(DISPLAY_LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

const date = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatMoney = (value) =>
  value == null || value === "" || !Number.isFinite(Number(value))
    ? "Not specified"
    : money.format(Number(value));

export const parseDisplayDate = (value) => {
  if (value == null || value === "") return null;

  const parsed = new Date(
    Number.isFinite(Number(value)) ? Number(value) : value,
  );
  
  return Number.isNaN(parsed.getTime()) || parsed.getTime() <= 0
    ? null
    : parsed;
};

export const formatDate = (value) => {
  const parsed = parseDisplayDate(value);
  return parsed ? date.format(parsed) : "Not recorded";
};

const fullDate = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

const time = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const weekday = new Intl.DateTimeFormat(DISPLAY_LOCALE, { weekday: "long" });

const monthDay = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  day: "numeric",
  month: "long",
});

const relativeTime = new Intl.RelativeTimeFormat(DISPLAY_LOCALE, {
  numeric: "always",
});

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// Compare local calendar days without treating daylight-saving days as 24 hours.
const calendarDay = (value) =>
  Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / DAY_MS;

export const formatFullDate = (value) => {
  const parsed = parseDisplayDate(value);
  return parsed ? fullDate.format(parsed) : "Not recorded";
};

export const formatRelativeDate = (value, now = Date.now()) => {
  const parsed = parseDisplayDate(value);

  if (!parsed) return "Not recorded";

  const reference = new Date(now);
  if (Number.isNaN(reference.getTime())) return formatDate(value);

  const difference = parsed.getTime() - reference.getTime();

  const distance = Math.abs(difference);

  const days = calendarDay(parsed) - calendarDay(reference);

  if (distance < MINUTE_MS) return difference > 0 ? "In a moment" : "Just now";

  if (distance < HOUR_MS)
    return relativeTime.format(Math.trunc(difference / MINUTE_MS), "minute");

  if (days === 0 && distance < 6 * HOUR_MS)
    return relativeTime.format(Math.trunc(difference / HOUR_MS), "hour");

  const atTime = " at " + time.format(parsed);
  if (days === 0) return "Today" + atTime;
  if (days === -1) return "Yesterday" + atTime;
  if (days === 1) return "Tomorrow" + atTime;
  if (days < -1 && days > -7) return weekday.format(parsed) + atTime;

  const day = monthDay.format(parsed);
  if (parsed.getFullYear() === reference.getFullYear()) return day + atTime;
  if (parsed.getFullYear() === reference.getFullYear() - 1)
    return "Last year · " + day + atTime;

  return day + " " + parsed.getFullYear() + atTime;
};

export const CURRENCY_SYMBOL = "€";
