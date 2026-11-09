import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { getCheckoutDefaults } from "@/services/checkoutService";
import { usePaymentCards } from "@/hooks/usePaymentCards";
import {
  ADDRESS_FIELDS,
  CARD_FIELDS,
  toCheckoutPayload,
} from "@/utils/UtilsCheckout";
export const useCheckoutForm = (purchase) => {
  const [form] = Form.useForm();
  const payment = usePaymentCards(form);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(null);
  const [usingSaved, setUsingSaved] = useState(false);
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pending = useRef(false);
  const values =
    Form.useWatch((values) => values, { form, preserve: true }) || {};
  useEffect(() => {
    if (!purchase.confirmOpen) return;
    const controller = new AbortController();
    setStep(0);
    setWarning("");
    setError("");
    setSaved(null);
    setUsingSaved(false);
    payment.reset();
    form.resetFields();
    const load = async () => {
      try {
        const user = await getCheckoutDefaults(controller.signal);
        if (controller.signal.aborted) return;
        setSaved(user);
        if (
          ADDRESS_FIELDS.every((key) => user[key]) &&
          !form.isFieldsTouched(ADDRESS_FIELDS)
        ) {
          form.setFieldsValue(user);
          setUsingSaved(true);
        }
      } catch (error) {
        if (!controller.signal.aborted) setWarning(error.message);
      }
      if (!controller.signal.aborted) await payment.load(controller.signal);
    };
    load();
    return () => controller.abort();
  }, [purchase.confirmOpen, form, payment.reset, payment.load]);
  const next = async () => {
    if (step === 1 && payment.loading) return;
    try {
      await form.validateFields(
        step === 0 ? ADDRESS_FIELDS : payment.isSaved ? [] : CARD_FIELDS,
      );
      setStep(step + 1);
    } catch {
      /* Validation errors are shown beside their fields. */
    }
  };
  const confirm = async () => {
    if (pending.current || payment.loading) return;

    pending.current = true;

    setSubmitting(true);
    setError("");

    try {
      const values = await form.validateFields(
        payment.isSaved ? ADDRESS_FIELDS : [...ADDRESS_FIELDS, ...CARD_FIELDS],
      );
      // The card controller saves or recovers the card before the purchase is sent.
      const buyerPaymentId = await payment.resolve(values);
      const result = await purchase.confirmPurchase(
        toCheckoutPayload(values, buyerPaymentId),
      );

      if (result?.error?.fieldErrors?.length) {
        form.setFields(result.error.fieldErrors);
        setStep(
          result.error.fieldErrors.some((field) =>
            ADDRESS_FIELDS.includes(field.name),
          )
            ? 0
            : 1,
        );
      }
    } catch (error) {
      if (error.errorFields?.length) {
        setStep(
          error.errorFields.some((field) =>
            ADDRESS_FIELDS.includes(field.name[0]),
          )
            ? 0
            : 1,
        );
      } else {
        setError(error.message);
        if (error.fieldErrors?.length) form.setFields(error.fieldErrors);
        setStep(1);
      }
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  const changeValues = (changed) => {
    if (ADDRESS_FIELDS.some((key) => key in changed)) setUsingSaved(false);
    if (CARD_FIELDS.some((key) => key in changed)) payment.changed(changed);
    setError("");
  };

  return {
    form,
    step,
    values,
    warning,
    error,
    submitting,
    payment,
    usingSaved,
    next,
    confirm,
    changeValues,
    hasSavedAddress: saved && ADDRESS_FIELDS.every((key) => saved[key]),
    toggleSaved: (event) => {
      setUsingSaved(event.target.checked);
      if (event.target.checked) form.setFieldsValue(saved);
    },
    back: () => setStep(step - 1),
  };
};
