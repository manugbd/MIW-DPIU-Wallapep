export const COUNTRIES = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Bolivia",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Guatemala",
  "Honduras",
  "Iceland",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
].map((country) => ({ value: country, label: country }));

export const DOCUMENT_TYPES = [
  { value: "DNI", label: "DNI" },
  { value: "NIE", label: "NIE" },
  { value: "Pasaporte", label: "Passport" },
  { value: "Otro", label: "Other" },
];

export const DOCUMENT_FORMATS = {
  DNI: { placeholder: "12345678", maxLength: 8 },
  NIE: { placeholder: "e.g. X1234567L", maxLength: 9 },
  Pasaporte: { placeholder: "Passport number", maxLength: 20 },
  Otro: { placeholder: "Document number", maxLength: 50 },
};

const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
export const getDniCheckLetter = (digits) =>
  /^[0-9]{8}$/.test(digits) ? NIF_LETTERS[Number(digits) % 23] : "";

const DOCUMENT_PATTERNS = {
  DNI: /^\d{8}[A-Z]$/,
  NIE: /^[XYZ]\d{7}[A-Z]$/,
  Pasaporte: /^[A-Z0-9]{5,20}$/,
  Otro: /^[A-Z0-9-]{3,50}$/,
};

export const formatDocumentNumber = (type, value) => {
  const normalized = value.toUpperCase().replace(/\s/g, "");
  if (type === "DNI") {
    const digits = normalized.replace(/[^0-9]/g, "").slice(0, 8);
    return digits + getDniCheckLetter(digits);
  }
  if (type === "NIE")
    return normalized.replace(/[^0-9XYZA-Z]/g, "").slice(0, 9);
  return normalized.slice(0, DOCUMENT_FORMATS[type]?.maxLength || 50);
};

export const getDocumentNumberProblem = (type, value) => {
  if (!value) return null;
  const normalized = value.toUpperCase().replace(/\s/g, "");
  if (!(DOCUMENT_PATTERNS[type] || DOCUMENT_PATTERNS.Otro).test(normalized)) {
    return "invalid-format";
  }

  let controlNumber;
  if (type === "DNI") controlNumber = Number(normalized.slice(0, 8));
  if (type === "NIE") {
    const firstDigit = { X: "0", Y: "1", Z: "2" }[normalized[0]];
    controlNumber = Number(`${firstDigit}${normalized.slice(1, 8)}`);
  }
  if (
    controlNumber !== undefined &&
    NIF_LETTERS[controlNumber % 23] !== normalized.at(-1)
  ) {
    return "invalid-control-letter";
  }
  return null;
};
