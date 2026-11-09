import { useEffect, useRef, useState } from "react";
import { buyProduct } from "@/services/transactionsService";
import { getUserIdFromToken } from "@/utils/UtilsSession";
import { getPurchaseAvailability } from "@/utils/UtilsProductPurchase";

const INITIAL_PURCHASE = { confirmOpen: false, purchasing: false, error: "", transactionId: null };
const CLOSE_CONFIRMATION_STATUSES = [401, 404, 409];
const REFRESH_PRODUCT_STATUSES = [404, 409];

export const useProductPurchase = ({ product, onPurchased, onRefresh }) => {
  const [purchase, setPurchase] = useState(INITIAL_PURCHASE);
  const [userId, setUserId] = useState(null);
  // Protect against double clicks and responses received after leaving the product.
  const request = useRef({ pending: false, mounted: false, productId: null });
  request.current.productId = product?.id;
  useEffect(() => {
    request.current.mounted = true;
    return () => {
      request.current.mounted = false;
    };
  }, []);
  useEffect(() => {
    setPurchase(INITIAL_PURCHASE);
    setUserId(getUserIdFromToken(localStorage.getItem("apiKey")));
  }, [product?.id]);
  const availability = getPurchaseAvailability(product, userId);

  const isCurrentProduct = (id) =>
    request.current.mounted && request.current.productId === id;

  const openConfirmation = () => {
    if (!availability.available || request.current.pending) return;

    setPurchase({
      ...INITIAL_PURCHASE,
      confirmOpen: true,
    });
  };
  const closeConfirmation = () => {
    if (request.current.pending) return;

    setPurchase((current) => ({
      ...current,
      confirmOpen: false,
    }));
  };
  const handlePurchaseError = (error) => {
    const mustClose = CLOSE_CONFIRMATION_STATUSES.includes(error.status);

    setPurchase((current) => ({
      ...current,
      purchasing: false,
      error: error.message,
      confirmOpen: mustClose ? false : current.confirmOpen,
    }));

    if (REFRESH_PRODUCT_STATUSES.includes(error.status)) onRefresh();
  };
  const confirmPurchase = async (details) => {
    if (!availability.available || request.current.pending) return;

    const productId = product.id;
    request.current.pending = true;

    setPurchase((current) => ({
      ...current,
      purchasing: true,
      error: "",
    }));

    try {
      const transaction = await buyProduct(productId, details);
      if (!isCurrentProduct(productId)) return;
      onPurchased(userId);
      setPurchase({
        ...INITIAL_PURCHASE,
        transactionId: transaction.insertId,
      });
    } catch (error) {
      if (isCurrentProduct(productId)) handlePurchaseError(error);
      return {
        error,
      };
    } finally {
      request.current.pending = false;
    }
  };

  return { ...purchase, availability, openConfirmation, closeConfirmation, confirmPurchase };
};
