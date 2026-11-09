import { useEffect, useState } from "react";
import { getPublicTransactions } from "@/services/transactionsService";

export default function SellerReputation({ id }) {
  const [activity, setActivity] = useState(null),
    [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setActivity(null);
    setError(false);

    getPublicTransactions(id)
      .then((data) => {
        if (!controller.signal.aborted) setActivity(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });

    return () => controller.abort();
  }, [id]);

  if (error) return <span>Activity unavailable</span>;

  if (!activity) return <span>Loading activity…</span>;

  const sales = activity.filter(
    (t) => String(t.sellerId) === String(id),
  ).length;
  
  return (
    <span>
      {activity.length} transactions · {sales} sales
    </span>
  );
}
