import { Empty } from "antd";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import ListPagination from "@/components/ListPagination";
import { useTransactionList } from "@/hooks/useTransactionList";
import { PUBLIC_TRANSACTION_SORT } from "@/utils/UtilsTransactions";

export default function ProfileTransactions({ transactions, userId }) {
  const list = useTransactionList(
    transactions,
    userId,
    PUBLIC_TRANSACTION_SORT,
  );
  
  return (
    <>
      <TransactionFilters
        filters={list.filters}
        onTextChange={list.changeText}
        onTypeChange={list.changeType}
        onClear={list.clearFilters}
      />
      <p role="status" aria-live="polite">
        {list.resultCount} public transactions
      </p>
      <TransactionsTable
        transactions={list.pagination.items}
        userId={userId}
        sort={list.sort}
        onSort={list.changeSort}
        publicView
        emptyText={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No public transactions to show. Try clearing your filters."
          />
        }
      />
      <ListPagination pagination={list.pagination} />
    </>
  );
}
