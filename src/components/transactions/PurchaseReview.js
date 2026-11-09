import { maskCardNumber } from "@/utils/UtilsCreditCard";
import { Descriptions } from "antd";
import { formatMoney } from "@/utils/UtilsFormat";

export default function PurchaseReview({ values, product, card }) {
  return (
    <>
      <h3>Review your purchase</h3>
      <Descriptions
        column={1}
        bordered
        size="small"
        items={[
          {
            key: "delivery",
            label: "Deliver to",
            children: [values.address, values.postalCode, values.country]
              .filter(Boolean)
              .join(", "),
          },
          {
            key: "card",
            label: "Card",
            children: card
              ? `${card.alias} · ${card.number}`
              : `${values.alias || ""} · ${maskCardNumber(values.number)}`,
          },
          {
            key: "total",
            label: "Total",
            children: formatMoney(product.price),
          },
        ]}
      />
    </>
  );
}
