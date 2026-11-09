import { getDocumentNumberProblem } from "./UtilsUser";
import { validateDateNotInFuture } from "./UtilsValidations";

const DOCUMENT_MESSAGES = {
  DNI: "Enter all 8 digits. The check letter is calculated automatically.",
  NIE: "Format: X, Y or Z, 7 digits and a letter, for example X1234567L.",
  Pasaporte: "Enter 5 to 20 letters or digits.",
  Otro: "Enter 3 to 50 letters, digits or hyphens.",
};

export const validateRegistrationDocument = (type, value) => {
  const problem = getDocumentNumberProblem(type, value);

  if (problem === "invalid-format") {
    return Promise.reject(
      new Error(DOCUMENT_MESSAGES[type] || DOCUMENT_MESSAGES.Otro),
    );
  }

  if (problem === "invalid-control-letter") {
    const label = type === "DNI" ? "DNI" : "NIE";
    return Promise.reject(
      new Error(
        "The " + label + " check letter does not match the number entered.",
      ),
    );
  }

  return Promise.resolve();
};

export const validateRegistrationBirthday = (value) => {
  if (!value) return Promise.resolve();
  return validateDateNotInFuture(value, {
    invalidMessage: "Enter a valid date in day/month/year format.",
    futureMessage: "The date cannot be later than today.",
  });
};

export const validateRegistrationPostalCode = (country, value) => {
  if (!value || country !== "Spain" || /^\d{5}$/.test(value))
    return Promise.resolve();
  
  return Promise.reject(new Error("Spanish postal codes contain 5 digits."));
};
