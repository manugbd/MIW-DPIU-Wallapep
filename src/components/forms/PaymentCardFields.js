import { DatePicker, Form, Input } from "antd";
import { CARD_RULES } from "@/utils/UtilsCheckout";
import { MONTH_INPUT_FORMAT } from "@/utils/UtilsDates";

export default function PaymentCardFields() {
  return (
    <>
      <h3>Payment card</h3>
      <p>Use test card details for this exercise.</p>
      <Form.Item name="alias" label="Cardholder" rules={CARD_RULES.alias}>
        <Input autoComplete="cc-name" maxLength={50} />
      </Form.Item>
      <Form.Item
        name="number"
        label="Card number"
        rules={CARD_RULES.number}
        normalize={(value) => value.replace(/\s/g, "")}
      >
        <Input autoComplete="cc-number" inputMode="numeric" maxLength={23} />
      </Form.Item>
      <Form.Item
        name="expirationDate"
        label="Expiry month"
        rules={CARD_RULES.expirationDate}
      >
        <DatePicker
          picker="month"
          format={MONTH_INPUT_FORMAT}
          disabledDate={(date) => date.endOf("month").valueOf() < Date.now()}
        />
      </Form.Item>
      <Form.Item name="code" label="Security code" rules={CARD_RULES.code}>
        <Input.Password
          autoComplete="cc-csc"
          inputMode="numeric"
          maxLength={4}
        />
      </Form.Item>
    </>
  );
}
