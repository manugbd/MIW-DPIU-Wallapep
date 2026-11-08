const euroFormat = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export const formatProductPrice = (price) => {
  if (price === null || price === undefined || price === "")
    return "Price not specified";

  const amount = Number(price);

  if (!Number.isFinite(amount)) return "Price not specified";
  
  return amount === 0 ? "Free" : euroFormat.format(amount);
};

export const getProductImageUrl = (id) =>
  `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/images/${id}.png`;
