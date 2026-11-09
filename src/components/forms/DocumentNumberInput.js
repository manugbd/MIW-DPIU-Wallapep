import { Input } from "antd";
import {
  DOCUMENT_FORMATS,
  formatDocumentNumber,
  getDniCheckLetter,
} from "@/utils/UtilsUser";
import styles from "@/styles/DocumentNumberInput.module.css";

export default function DocumentNumberInput({
  documentType,
  value = "",
  onChange,
  ...props
}) {
  const isDni = documentType === "DNI";
  const digits = value.replace(/[^0-9]/g, "").slice(0, 8);
  const letter = isDni ? getDniCheckLetter(digits) : "";
  
  return (
    <Input
      {...props}
      value={isDni ? digits : value}
      onChange={(event) =>
        onChange?.(formatDocumentNumber(documentType, event.target.value))
      }
      className={isDni ? styles.dni : undefined}
      allowClear={!isDni}
      inputMode={isDni ? "numeric" : "text"}
      maxLength={DOCUMENT_FORMATS[documentType]?.maxLength || 50}
      autoComplete="off"
      placeholder={
        DOCUMENT_FORMATS[documentType]?.placeholder || "Document number"
      }
      suffix={
        isDni ? (
          <span
            className={styles.letter}
            aria-label={
              letter
                ? "Calculated check letter: " + letter
                : "Check letter calculated after 8 digits"
            }
          >
            {letter || ""}
          </span>
        ) : undefined
      }
    />
  );
}
