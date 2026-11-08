export const COUNTRIES = [
  "Alemania", "Argentina", "Australia", "Austria", "Bélgica", "Bolivia",
  "Brasil", "Canadá", "Chile", "China", "Colombia", "Corea del Sur",
  "Costa Rica", "Cuba", "Dinamarca", "Ecuador", "Egipto", "El Salvador",
  "España", "Estados Unidos", "Filipinas", "Finlandia", "Francia", "Grecia",
  "Guatemala", "Honduras", "India", "Irlanda", "Islandia", "Italia", "Japón",
  "Marruecos", "México", "Noruega", "Nueva Zelanda", "Países Bajos", "Panamá",
  "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Dominicana",
  "Rumanía", "Suecia", "Suiza", "Ucrania", "Uruguay", "Venezuela",
].map((country) => ({ value: country, label: country }));

export const DOCUMENT_TYPES = [
  { value: "DNI", label: "DNI" },
  { value: "NIE", label: "NIE" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "Otro", label: "Otro" },
];

export const DOCUMENT_FORMATS = {
  DNI: { placeholder: "Ej.: 12345678Z", maxLength: 9 },
  NIE: { placeholder: "Ej.: X1234567L", maxLength: 9 },
  Pasaporte: { placeholder: "Número de pasaporte", maxLength: 20 },
  Otro: { placeholder: "Número de documento", maxLength: 50 },
};

const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const DOCUMENT_PATTERNS = {
  DNI: /^\d{8}[A-Z]$/,
  NIE: /^[XYZ]\d{7}[A-Z]$/,
  Pasaporte: /^[A-Z0-9]{5,20}$/,
  Otro: /^[A-Z0-9-]{3,50}$/,
};

export const formatDocumentNumber = (type, value) => {
  const normalized = value.toUpperCase().replace(/\s/g, "");
  if (type === "DNI") return normalized.replace(/[^0-9A-Z]/g, "").slice(0, 9);
  if (type === "NIE") return normalized.replace(/[^0-9XYZA-Z]/g, "").slice(0, 9);
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
  if (controlNumber !== undefined && NIF_LETTERS[controlNumber % 23] !== normalized.at(-1)) {
    return "invalid-control-letter";
  }
  return null;
};
