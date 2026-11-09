import { Descriptions } from "antd";
import { formatMoney } from "@/utils/UtilsFormat";

export default function PurchaseReview({ values, product }) {
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
            children: `${values.alias || ""} · •••• ${values.number?.slice(-4) || ""}`,
          },
          {
            key: "total",
            label: "Total",
            children: formatMoney(product.price),
          },
        ]}
      />
      <p>The purchase date is recorded automatically when you confirm.</p>
    </>
  );
}
