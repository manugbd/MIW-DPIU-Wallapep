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

export const formatDate = (value) => {
  if (value == null || value === "") return "Not recorded";

  const parsed = new Date(
    Number.isFinite(Number(value)) ? Number(value) : value,
  );
  
  return Number.isNaN(parsed.getTime()) || parsed.getTime() <= 0
    ? "Not recorded"
    : date.format(parsed);
};

export const CURRENCY_SYMBOL = "€";
