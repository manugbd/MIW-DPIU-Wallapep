import { useEffect, useState } from "react";
import { getPublicTransactions } from "@/services/transactionsService";
import { getProductsForSaleByUser } from "@/services/productsService";
import { usePublicUser } from "@/hooks/usePublicUser";

export const useUserProfile = (id) => {
  const user = usePublicUser(id);

  const [revision, setRevision] = useState(0);
  const [activity, setActivity] = useState({
    transactions: [],
    products: [],
    loading: true,
    historyError: "",
    productsError: "",
  });

  useEffect(() => {
    if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) return;

    const controller = new AbortController();

    setActivity((current) => ({
      ...current,
      loading: true,
      historyError: "",
      productsError: "",
    }));

    Promise.allSettled([
      getPublicTransactions(id, controller.signal),
      getProductsForSaleByUser(id, controller.signal),
    ]).then(([history, products]) => {
      if (controller.signal.aborted) return;

      setActivity({
        loading: false,
        transactions: history.status === "fulfilled" ? history.value : [],
        products: products.status === "fulfilled" ? products.value : [],
        historyError:
          history.status === "rejected"
            ? "Public activity could not be loaded."
            : "",
        productsError:
          products.status === "rejected" ? "Products could not be loaded." : "",
      });
    });

    return () => controller.abort();
  }, [id, revision]);

  const reload = () => {
    user.reload();
    setRevision((value) => value + 1);
  };
  
  return {
    ...user,
    ...activity,
    loading: user.loading,
    activityLoading: activity.loading,
    reload,
  };
};
