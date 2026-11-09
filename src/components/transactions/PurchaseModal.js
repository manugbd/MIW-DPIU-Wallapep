import { Alert, Button, Checkbox, Form, Modal, Space, Steps } from "antd";
import AddressFields from "@/components/forms/AddressFields";
import PaymentCardFields from "@/components/forms/PaymentCardFields";
import PurchaseReview from "@/components/transactions/PurchaseReview";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { CHECKOUT_STEPS } from "@/utils/UtilsCheckout";
import { formatMoney } from "@/utils/UtilsFormat";

export default function PurchaseModal({ product, purchase }) {
  const checkout = useCheckoutForm(purchase);
  const busy = checkout.submitting || purchase.purchasing;

  return (
    <Modal
      forceRender
      title="Complete your purchase"
      open={purchase.confirmOpen}
      onCancel={purchase.closeConfirmation}
      footer={null}
      width={640}
      closable={!busy}
      maskClosable={false}
      keyboard={!busy}
    >
      <Steps
        current={checkout.step}
        size="small"
        items={CHECKOUT_STEPS}
        className="checkout-steps"
      />
      <p>
        <strong>{product.title}</strong> · {formatMoney(product.price)}
      </p>
      {checkout.warning && (
        <Alert type="info" showIcon message={checkout.warning} />
      )}
      {checkout.error && (
        <Alert type="error" showIcon role="alert" message={checkout.error} />
      )}
      {purchase.error && (
        <Alert type="error" showIcon role="alert" message={purchase.error} />
      )}
      <Form
        form={checkout.form}
        layout="vertical"
        requiredMark="optional"
        disabled={busy}
        onValuesChange={checkout.changeValues}
      >
        <div hidden={checkout.step !== 0}>
          <h3>Delivery address</h3>
          {checkout.hasSavedAddress && (
            <Checkbox
              checked={checkout.usingSaved}
              onChange={checkout.toggleSaved}
            >
              Use my account address
            </Checkbox>
          )}
          <AddressFields form={checkout.form} required />
        </div>
        <div hidden={checkout.step !== 1}>
          <PaymentCardFields payment={checkout.payment} />
        </div>
        {checkout.step === 2 && (
          <PurchaseReview
            values={checkout.values}
            product={product}
            card={checkout.payment.card}
          />
        )}
        <Space className="form-actions">
          {checkout.step > 0 && (
            <Button onClick={checkout.back} disabled={busy}>
              Back
            </Button>
          )}
          <Button onClick={purchase.closeConfirmation} disabled={busy}>
            Cancel
          </Button>
          {checkout.step < 2 ? (
            <Button
              type="primary"
              onClick={checkout.next}
              disabled={
                busy || (checkout.step === 1 && checkout.payment.loading)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              loading={busy}
              disabled={checkout.payment.loading}
              onClick={checkout.confirm}
            >
              Confirm purchase · {formatMoney(product.price)}
            </Button>
          )}
        </Space>
      </Form>
    </Modal>
  );
}
