import { Alert, Button, Checkbox, Form, Modal, Space, Steps } from "antd";
import AddressFields from "@/components/forms/AddressFields";
import PaymentCardFields from "@/components/forms/PaymentCardFields";
import PurchaseReview from "@/components/transactions/PurchaseReview";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { CHECKOUT_STEPS } from "@/utils/UtilsCheckout";
import { formatMoney } from "@/utils/UtilsFormat";

export default function PurchaseModal({ product, purchase }) {
  const checkout = useCheckoutForm(purchase);
  
  return (
    <Modal
      forceRender
      title="Complete your purchase"
      open={purchase.confirmOpen}
      onCancel={purchase.closeConfirmation}
      footer={null}
      width={640}
      closable={!purchase.purchasing}
      maskClosable={false}
      keyboard={!purchase.purchasing}
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
      {purchase.error && (
        <Alert type="error" showIcon role="alert" message={purchase.error} />
      )}
      <Form
        form={checkout.form}
        layout="vertical"
        requiredMark="optional"
        disabled={purchase.purchasing}
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
          <PaymentCardFields />
        </div>
        {checkout.step === 2 && (
          <PurchaseReview values={checkout.values} product={product} />
        )}
        <Space className="form-actions">
          <Button
            onClick={purchase.closeConfirmation}
            disabled={purchase.purchasing}
          >
            Cancel
          </Button>
          {checkout.step > 0 && (
            <Button onClick={checkout.back} disabled={purchase.purchasing}>
              Back
            </Button>
          )}
          {checkout.step < 2 ? (
            <Button type="primary" onClick={checkout.next}>
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              loading={purchase.purchasing}
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
