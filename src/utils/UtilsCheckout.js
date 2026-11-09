import { expiryTimestamp } from "@/utils/UtilsCreditCard";
export const ADDRESS_FIELDS = ["country", "address", "postalCode"];

export const CARD_FIELDS = ["alias", "number", "expirationDate", "code"];

export const CHECKOUT_STEPS = [
  { title: "Delivery" },
  { title: "Card" },
  { title: "Review" },
];

export const CARD_RULES = {
  alias: [
    { required: true, whitespace: true, message: "Enter the cardholder name." },
    { max: 50 },
  ],
  number: [
    { required: true, message: "Enter the card number." },
    { pattern: /^\d{16}$/, message: "Enter exactly 16 digits." },
  ],
  expirationDate: [
    { required: true, message: "Enter the expiry date (MM / YY)." },
    {
      validator: (_, value) =>
        !value ||
        (expiryTimestamp(value) !== null &&
          expiryTimestamp(value) >= Date.now())
          ? Promise.resolve()
          : Promise.reject(
              new Error(
                "Enter a valid expiry date (MM / YY) that has not passed.",
              ),
            ),
    },
  ],
  code: [
    { required: true, message: "Enter the security code." },
    { pattern: /^\d{3,4}$/, message: "Use 3 or 4 digits." },
  ],
};

export const toCheckoutPayload = (values, buyerPaymentId) => ({
  country: values.country,
  address: values.address,
  postalCode: values.postalCode,
  buyerPaymentId,
});
