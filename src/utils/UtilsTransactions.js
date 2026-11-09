import { formatMoney, formatDate } from "@/utils/UtilsFormat";

export const PUBLIC_TRANSACTION_SORT = { field: "id", order: "descend" };

export const mergePublicTransactions = (...lists) => [
  ...new Map(
    lists
      .flat()
      .map((transaction) => [
        String(getTransactionId(transaction)),
        transaction,
      ]),
  ).values(),
];

export const TRANSACTION_TYPE_OPTIONS = [
  { value: "all", label: "All activity" },
  { value: "purchase", label: "Purchases" },
  { value: "sale", label: "Sales" },
];

export const DEFAULT_TRANSACTION_SORT = {
  field: "startDate",
  order: "descend",
};

export const getTransactionId = (transaction) =>
  transaction.tid ?? transaction.id;

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

const numericValue = (value) =>
  hasValue(value) && Number.isFinite(Number(value)) ? Number(value) : null;

export const formatTransactionAmount = formatMoney;

export const formatTransactionDate = formatDate;

export const getTransactionRole = (transaction, userId) => {
  const buyer =
    userId != null && String(transaction.buyerId) === String(userId);

  const seller =
    userId != null && String(transaction.sellerId) === String(userId);

  if (buyer && seller)
    return { value: "both", label: "Purchase & sale", color: "purple" };

  if (buyer) return { value: "purchase", label: "Purchase", color: "blue" };

  if (seller) return { value: "sale", label: "Sale", color: "cyan" };

  return { value: "unknown", label: "Not available", color: undefined };
};

export const filterTransactions = (transactions, userId, { text, type }) => {
  const search = normalize(text).trim();

  return transactions.filter((transaction) => {
    const role = getTransactionRole(transaction, userId).value;

    if (type !== "all" && role !== type && role !== "both") return false;

    if (!search) return true;

    return [
      getTransactionId(transaction),
      `#${getTransactionId(transaction)}`,
      transaction.title,
      transaction.buyerName,
      transaction.buyerEmail,
      transaction.sellerName,
      transaction.sellerEmail,
    ].some((value) => normalize(value).includes(search));
  });
};

export const sortTransactions = (transactions, { field, order }) => {
  const direction = order === "ascend" ? 1 : -1;

  return [...transactions].sort((first, second) => {
    if (field === "title")
      return (
        direction *
        String(first.title ?? "").localeCompare(
          String(second.title ?? ""),
          "en",
        )
      );

    const a = numericValue(
        field === "id" ? getTransactionId(first) : first[field],
      ),
      b = numericValue(
        field === "id" ? getTransactionId(second) : second[field],
      );

    if (a === null) return b === null ? 0 : 1;

    if (b === null) return -1;

    return direction * (a - b);
  });
};

export const summarizeTransactions = (transactions, userId) =>
  transactions.reduce(
    (summary, transaction) => {
      const role = getTransactionRole(transaction, userId).value;
      const amount = numericValue(transaction.productPrice);

      if (amount === null) summary.missingPrices += 1;

      if (role === "purchase" || role === "both") {
        summary.purchases += 1;
        summary.spent += amount ?? 0;
      }

      if (role === "sale" || role === "both") {
        summary.sales += 1;
        summary.earned += amount ?? 0;
      }
      
      return summary;
    },
    { purchases: 0, sales: 0, spent: 0, earned: 0, missingPrices: 0 },
  );
