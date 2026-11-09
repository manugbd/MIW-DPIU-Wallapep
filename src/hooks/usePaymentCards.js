import { useCallback, useState } from "react";
import {
  getCreditCards,
  createCreditCard,
} from "@/services/creditCardsService";
import { CARD_FIELDS } from "@/utils/UtilsCheckout";
import {
  cardToFormValues,
  formatCardExpiry,
  isReusableCard,
  maskCardNumber,
  maskCardNumberDetail,
  sameCreditCard,
  toCreditCardPayload,
} from "@/utils/UtilsCreditCard";

export const usePaymentCards = (form) => {

  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState("new");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const clearFields = useCallback(
    () =>
      form.setFields(
        CARD_FIELDS.map((name) => ({
          name,
          value: "",
          errors: [],
          touched: false,
        })),
      ),
    [form],
  );

  const reset = useCallback(() => {
    setCards([]);
    setSelected("new");
    setLoading(true);
    setError("");
  }, []);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const data = await getCreditCards(signal);
        if (signal?.aborted) return;
        setCards(data);
        const latest = [...data]
          .filter(isReusableCard)
          .sort((a, b) => Number(b.id) - Number(a.id))[0];
        if (latest && !form.isFieldsTouched(CARD_FIELDS)) {
          clearFields();
          setSelected(String(latest.id));
        }
      } catch (error) {
        if (!signal?.aborted) setError(error.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [form, clearFields],
  );

  const select = (value) => {
    if (loading) return;
    clearFields();
    setSelected(value);
  };

  const resolve = async (values) => {
    if (loading) throw new Error("Please wait for your saved cards to load.");

    if (selected !== "new") {
      const card = cards.find(
        (card) => String(card.id) === selected && isReusableCard(card),
      );
      if (!card) throw new Error("Choose an available card or use a new card.");
      return card.id;
    }

    const existing = cards.find(
      (card) => isReusableCard(card) && sameCreditCard(card, values),
    );

    if (existing) {
      clearFields();
      setSelected(String(existing.id));
      return existing.id;
    }

    const payload = toCreditCardPayload(values);
    const id = await createCreditCard(payload);

    setCards((current) => [...current, { ...payload, id }]);

    clearFields();
    setSelected(String(id));

    return id;
  };
  const chosen = cards.find((card) => String(card.id) === selected);
  return {
    loading,
    error,
    selected,
    load,
    reset,
    select,
    resolve,
    isSaved: selected !== "new",
    card: chosen
      ? {
          id: chosen.id,
          alias: chosen.alias || "Card",
          number: maskCardNumber(chosen.number),
          detailNumber: maskCardNumberDetail(chosen.number),
          expirationDate: formatCardExpiry(chosen.expirationDate),
        }
      : null,
    changed: (changed) => {
      const existing =
        changed.number &&
        cards.find(
          (card) =>
            isReusableCard(card) &&
            cardToFormValues(card).number === changed.number,
        );
        
      if (existing) {
        clearFields();
        setSelected(String(existing.id));
      }
    },
    options: [
      { value: "new", label: "Use a new card" },
      ...cards.map((card) => ({
        value: String(card.id),
        label: `${card.alias || "Card"} · ${maskCardNumber(card.number)}`,
        disabled: !isReusableCard(card),
      })),
    ],
  };
};
