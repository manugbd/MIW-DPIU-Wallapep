import { useEffect, useState } from "react";
import { getProduct } from "@/services/productsService";

// Loads the product. Purchase behaviour lives in useProductPurchase.
export const useProductDetails = id => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (id === undefined) return;
    if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
      setError("Choose a valid product.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const loadedProduct = await getProduct(id, controller.signal);
        if (!controller.signal.aborted) setProduct(loadedProduct);
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [id, reloadCount]);

  const refresh = () => setReloadCount(count => count + 1);
  const markPurchased = buyerId => setProduct(current => current ? { ...current, buyerId } : current);

  return { product, loading, error, refresh, markPurchased };
};
