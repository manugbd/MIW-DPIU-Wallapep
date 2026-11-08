export const parseDecimalInput = (value) => {
  const normalized = String(value ?? "")
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "");
  const [whole, ...fraction] = normalized.split(".");

  return fraction.length
    ? `${whole || "0"}.${fraction.join("").slice(0, 2)}`
    : whole;
};

export const formatDecimalInput = (value, { userTyping, input }) => {
  if (userTyping) return parseDecimalInput(input);
  if (value === "" || value === null || value === undefined) return "";

  const number = Number(value);
  
  return Number.isFinite(number) ? number.toFixed(2) : "";
};
