import { getDocumentNumberProblem } from "./UtilsUser";
import { validateDateNotInFuture } from "./UtilsValidations";


const DOCUMENT_MESSAGES = {
  DNI: "Formato: 8 números y una letra, por ejemplo 12345678Z.",
  NIE: "Formato: X, Y o Z, 7 números y una letra, por ejemplo X1234567L.",
  Pasaporte: "Introduce entre 5 y 20 letras o números.",
  Otro: "Introduce entre 3 y 50 letras, números o guiones.",
};

export const validateRegistrationDocument = (type, value) => {
  const problem = getDocumentNumberProblem(type, value);
  if (problem === "invalid-format") {
    return Promise.reject(new Error(DOCUMENT_MESSAGES[type] || DOCUMENT_MESSAGES.Otro));
  }
  if (problem === "invalid-control-letter") {
    const label = type === "DNI" ? "DNI" : "NIE";
    return Promise.reject(new Error("La letra del " + label + " no corresponde con el número introducido."));
  }
  return Promise.resolve();
};

export const validateRegistrationBirthday = (value) => {
  if (!value) return Promise.resolve();
  return validateDateNotInFuture(value, {
    invalidMessage: "Introduce una fecha válida con formato día/mes/año.",
    futureMessage: "La fecha no puede ser posterior a hoy.",
  });
};

export const validateRegistrationPostalCode = (country, value) => {
  if (!value || country !== "España" || /^\d{5}$/.test(value)) return Promise.resolve();
  return Promise.reject(new Error("En España, el código postal tiene 5 números."));
};
