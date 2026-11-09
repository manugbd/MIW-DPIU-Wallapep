import { useEffect, useState } from "react";
import { getOwnTransactions } from "@/services/transactionsService";
import { getUserIdFromToken } from "@/utils/UtilsSession";
import { useTransactionList } from "@/hooks/useTransactionList";

export const useOwnTransactions = () => {
  const [data, setData] = useState({
    transactions: [],
    userId: null,
    loading: true,
    error: "",
  });

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const userId = getUserIdFromToken(localStorage.getItem("apiKey"));

    setData((previous) => ({
      ...previous,
      loading: true,
      error: "",
    }));

    getOwnTransactions(controller.signal)
      .then((transactions) => {
        if (!controller.signal.aborted)
          setData({
            transactions,
            userId,
            loading: false,
            error: "",
          });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setData((previous) => ({
            ...previous,
            loading: false,
            error: error.message,
          }));
      });
    return () => controller.abort();
  }, [revision]);

  const list = useTransactionList(data.transactions, data.userId);
  const reload = () => setRevision((value) => value + 1);
  
  return {
    ...data,
    ...list,
    reload,
  };
};
