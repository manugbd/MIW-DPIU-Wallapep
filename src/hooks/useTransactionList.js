import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import {
  DEFAULT_TRANSACTION_SORT,
  filterTransactions,
  sortTransactions,
  summarizeTransactions,
} from "@/utils/UtilsTransactions";

export const useTransactionList = ( transactions, userId, initialSort = DEFAULT_TRANSACTION_SORT) => {
  const [filters, setFilters] = useState({
    text: "",
    type: "all",
  });

  const [sort, setSort] = useState(initialSort);

  const results = useMemo(
    () =>
      sortTransactions(filterTransactions(transactions, userId, filters), sort),
    [transactions, userId, filters, sort],
  );

  const summary = useMemo(
    () => summarizeTransactions(transactions, userId),
    [transactions, userId],
  );

  const pagination = usePagination(results, {
    resetKey: `${userId}|${filters.text}|${filters.type}|${sort.field}|${sort.order}`,
  });

  const changeText = (event) =>
    setFilters((current) => ({
      ...current,
      text: event.target.value,
    }));

  const changeType = (type) =>
    setFilters((current) => ({
      ...current,
      type,
    }));

  const clearFilters = () =>
    setFilters({
      text: "",
      type: "all",
    });

  const changeSort = (sorter) =>
    setSort(
      sorter.order
        ? {
            field: sorter.columnKey,
            order: sorter.order,
          }
        : initialSort,
    );
    
  return {
    filters,
    sort,
    summary,
    pagination,
    resultCount: results.length,
    changeText,
    changeType,
    clearFilters,
    changeSort,
  };
};
