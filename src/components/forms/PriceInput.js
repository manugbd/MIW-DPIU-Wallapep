import { InputNumber } from "antd";
import { formatDecimalInput, parseDecimalInput } from "@/utils/UtilsNumbers";
import { CURRENCY_SYMBOL } from "@/utils/UtilsFormat";

export default function PriceInput(props) {
  return (
    <InputNumber
      min={0}
      precision={2}
      step={0.01}
      inputMode="decimal"
      formatter={formatDecimalInput}
      parser={parseDecimalInput}
      addonAfter={CURRENCY_SYMBOL}
      {...props}
    />
  );
}
