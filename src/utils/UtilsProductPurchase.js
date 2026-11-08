export const getPurchaseAvailability = (product, userId) => {
  if (!product) return { available: false, label: "Buy product", reason: "" };

  if (!userId)
    return {
      available: false,
      label: "Sign in to buy",
      reason: "Sign in to buy this product.",
    };

  if (product.buyerId != null)
    return {
      available: false,
      label: "Sold",
      reason: "This product has already been sold.",
    };

  if (String(product.sellerId) === String(userId))
    return {
      available: false,
      label: "Your product",
      reason: "You cannot buy your own product.",
    };

  if ( product.price == null || !Number.isFinite(Number(product.price)) || Number(product.price) < 0)
    return { available: false, label: "Unavailable", reason: "This product does not have a valid price."};
  else
     return { available: true, label: "Buy product", reason: "" };
};
