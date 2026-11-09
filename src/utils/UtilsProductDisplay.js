import { formatMoney } from "@/utils/UtilsFormat";

export const formatProductPrice = (price) => {
  if (price === null || price === undefined || price === "")
    return "Price not specified";

  const amount = Number(price);

  if (!Number.isFinite(amount)) return "Price not specified";

  return amount === 0 ? "Free" : formatMoney(amount);
};

export const getProductImageUrl = (id) => `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/images/${id}.png`;
