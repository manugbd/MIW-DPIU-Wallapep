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
    { pattern: /^\d{13,19}$/, message: "Use 13 to 19 digits." },
  ],
  expirationDate: [
    { required: true, message: "Choose the expiry month." },
    {
      validator: (_, value) =>
        !value || value.endOf("month").valueOf() >= Date.now()
          ? Promise.resolve()
          : Promise.reject(new Error("This card has expired.")),
    },
  ],
  code: [
    { required: true, message: "Enter the security code." },
    { pattern: /^\d{3,4}$/, message: "Use 3 or 4 digits." },
  ],
};

export const toCheckoutPayload = (values) => ({
  country: values.country,
  address: values.address,
  postalCode: values.postalCode,
  card: {
    alias: values.alias,
    number: values.number.replace(/\s/g, ""),
    code: values.code,
    expirationDate: values.expirationDate.endOf("month").valueOf(),
  },
});
