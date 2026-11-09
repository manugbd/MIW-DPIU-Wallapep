export const CARD_NUMBER_LENGTH = 16;

export const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

export const formatCardNumber = (value) =>
  onlyDigits(value)
    .slice(0, CARD_NUMBER_LENGTH)
    .replace(/(.{4})(?=.)/g, "$1 ");

export const maskCardNumber = (value) => `•••• ${onlyDigits(value).slice(-4)}`;

export const maskCardNumberDetail = (value) =>
  `•••• •••• •••• ${onlyDigits(value).slice(-4)}`;

export const formatExpiryInput = (value) => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
};

export const expiryTimestamp = (value) => {
  const digits = onlyDigits(value);

  if (digits.length !== 4) return null;

  const month = Number(digits.slice(0, 2));

  if (month < 1 || month > 12) return null;

  return new Date(
    2000 + Number(digits.slice(2)),
    month,
    0,
    23,
    59,
    59,
    999,
  ).getTime();
};

export const formatCardExpiry = (value) => {
  const date = new Date(Number(value));

  return Number.isNaN(date.getTime())
    ? ""
    : `${String(date.getMonth() + 1).padStart(2, "0")} / ${String(date.getFullYear()).slice(-2)}`;
};

export const cardToFormValues = (card) => ({
  alias: card.alias || "",
  number: onlyDigits(card.number),
  expirationDate: formatCardExpiry(card.expirationDate),
  code:
    card.code == null
      ? ""
      : String(card.code).padStart(/^3[47]/.test(card.number) ? 4 : 3, "0"),
});

export const toCreditCardPayload = (values) => ({
  alias: values.alias.trim(),
  number: onlyDigits(values.number),
  expirationDate: expiryTimestamp(values.expirationDate),
  code: onlyDigits(values.code),
});

export const sameCreditCard = (card, values) => {
  const stored = cardToFormValues(card),
    next = toCreditCardPayload(values);

  return (
    stored.number === next.number &&
    stored.expirationDate === formatCardExpiry(next.expirationDate) &&
    stored.alias.trim() === next.alias &&
    stored.code === next.code
  );
};

export const isReusableCard = (card) =>
  Number.isSafeInteger(Number(card.id)) &&
  Number(card.id) > 0 &&
  onlyDigits(card.number).length === CARD_NUMBER_LENGTH &&
  Number(card.expirationDate) >= Date.now();
