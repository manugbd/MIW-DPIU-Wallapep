import { useEffect, useState } from "react";
import { Form } from "antd";
import { getCheckoutDefaults } from "@/services/checkoutService";
import {
  ADDRESS_FIELDS,
  CARD_FIELDS,
  toCheckoutPayload,
} from "@/utils/UtilsCheckout";

export const useCheckoutForm = (purchase) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(null);
  const [usingSaved, setUsingSaved] = useState(false);
  const [warning, setWarning] = useState("");

  const values =
    Form.useWatch((values) => values, {
      form,
      preserve: true,
    }) || {};

  useEffect(() => {
    if (!purchase.confirmOpen) return;

    let active = true;

    setStep(0);
    setWarning("");
    setSaved(null);
    setUsingSaved(false);

    form.resetFields();

    getCheckoutDefaults()
      .then((user) => {
        if (!active) return;
        setSaved(user);
        if (
          ADDRESS_FIELDS.every((key) => user[key]) &&
          !form.isFieldsTouched(ADDRESS_FIELDS)
        ) {
          form.setFieldsValue(user);
          setUsingSaved(true);
        }
      })
      .catch((error) => {
        if (active) setWarning(error.message);
      });
    return () => {
      active = false;
    };
  }, [purchase.confirmOpen, form]);

  const next = async () => {
    try {
      await form.validateFields(step === 0 ? ADDRESS_FIELDS : CARD_FIELDS);
      setStep(step + 1);
    } catch {
      /* Validation messages are displayed beside the fields. */
    }
  };

  const confirm = async () => {
    try {
      const values = await form.validateFields();
      const result = await purchase.confirmPurchase(toCheckoutPayload(values));
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
      if (error.errorFields?.length)
        setStep(
          error.errorFields.some((field) =>
            ADDRESS_FIELDS.includes(field.name[0]),
          )
            ? 0
            : 1,
        );
    }
  };

  const toggleSaved = (event) => {
    setUsingSaved(event.target.checked);
    if (event.target.checked) form.setFieldsValue(saved);
  };

  const changeValues = (changed) => {
    if (ADDRESS_FIELDS.some((key) => key in changed)) setUsingSaved(false);
  };
  
  return {
    form,
    step,
    values,
    warning,
    usingSaved,
    next,
    confirm,
    toggleSaved,
    changeValues,
    hasSavedAddress: saved && ADDRESS_FIELDS.every((key) => saved[key]),
    back: () => setStep(step - 1),
  };
};
