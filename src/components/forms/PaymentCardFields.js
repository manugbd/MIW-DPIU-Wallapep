import {
  Alert,
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Spin,
} from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { CARD_RULES } from "@/utils/UtilsCheckout";
import {
  CARD_NUMBER_LENGTH,
  formatCardNumber,
  formatExpiryInput,
  onlyDigits,
} from "@/utils/UtilsCreditCard";
import styles from "@/styles/PaymentCard.module.css";

export default function PaymentCardFields({ payment }) {
  return (
    <section
      className={styles.panel}
      aria-labelledby="payment-card-title"
      aria-busy={payment.loading}
    >
      <header className={styles.heading}>
        <CreditCardOutlined />
        <h3 id="payment-card-title">Pay by card</h3>
      </header>
      <p className={styles.hint}>
        Enter your card details or use a saved card.
      </p>
      <Form.Item label="Payment card" required>
        <Select
          value={payment.loading ? undefined : payment.selected}
          disabled={payment.loading}
          placeholder={
            payment.loading ? "Loading saved cards..." : "Choose a card"
          }
          onChange={payment.select}
          options={payment.options}
          loading={payment.loading}
          aria-label="Choose a saved card"
        />
      </Form.Item>
      {payment.error && (
        <Alert
          type="warning"
          showIcon
          message={payment.error}
          action={<Button onClick={() => payment.load()}>Retry</Button>}
        />
      )}
      {payment.loading ? (
        <div className={styles.loading} role="status">
          <Spin />
          <span>Loading saved cards...</span>
        </div>
      ) : payment.card ? (
        <Descriptions
          column={1}
          size="small"
          className={styles.savedCard}
          items={[
            {
              key: "name",
              label: "Name on card",
              children: payment.card.alias,
            },
            {
              key: "number",
              label: "Card number",
              children: payment.card.detailNumber,
            },
            {
              key: "expiry",
              label: "Expiry date",
              children: payment.card.expirationDate,
            },
          ]}
        />
      ) : (
        <>
          <Form.Item name="alias" label="Name on card" rules={CARD_RULES.alias}>
            <Input
              autoComplete="cc-name"
              maxLength={50}
              placeholder="Full name as shown on card"
            />
          </Form.Item>
          <Form.Item
            name="number"
            label="Card number"
            rules={CARD_RULES.number}
            normalize={(value) =>
              onlyDigits(value).slice(0, CARD_NUMBER_LENGTH)
            }
          >
            <CardNumberInput />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expirationDate"
                label="Expiry date"
                rules={CARD_RULES.expirationDate}
                normalize={formatExpiryInput}
              >
                <Input
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  maxLength={7}
                  placeholder="MM / YY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Security code (CVV)"
                rules={CARD_RULES.code}
                normalize={(value) => onlyDigits(value).slice(0, 4)}
              >
                <Input
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="CVV"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </section>
  );
}

function CardNumberInput({ value, onChange, ...props }) {
  return (
    <Input
      {...props}
      prefix={<CreditCardOutlined />}
      autoComplete="cc-number"
      inputMode="numeric"
      maxLength={19}
      placeholder="1234 5678 9012 3456"
      value={formatCardNumber(value)}
      onChange={onChange}
      className={styles.number}
    />
  );
}
