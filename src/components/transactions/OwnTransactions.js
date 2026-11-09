import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Empty, Skeleton } from "antd";
import { ReloadOutlined, ShoppingOutlined } from "@ant-design/icons";
import ListPagination from "@/components/ListPagination";
import TransactionSummary from "@/components/transactions/TransactionSummary";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import { useOwnTransactions } from "@/hooks/useOwnTransactions";
import styles from "@/styles/Transactions.module.css";

export default function OwnTransactions() {
  const activity = useOwnTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const openDetails = (transaction) => setSelectedTransaction(transaction);
  const closeDetails = () => setSelectedTransaction(null);

  const hasFilters =
    Boolean(activity.filters.text.trim()) || activity.filters.type !== "all";

  const emptyState = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        hasFilters
          ? "No transactions match your filters. Try another search or activity type."
          : "You have not bought or sold any products yet."
      }
    >
      {hasFilters ? (
        <Button onClick={activity.clearFilters}>Clear filters</Button>
      ) : (
        <Link href="/products">
          <Button type="primary">Browse products</Button>
        </Link>
      )}
    </Empty>
  );


  return (
    <section className={styles.page} aria-labelledby="transactions-title">
      <header className={styles.heading}>
        <div>
          <h1 id="transactions-title">
            <ShoppingOutlined /> My transactions
          </h1>
          <p>Review your purchases and sales.</p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={activity.reload}
          loading={activity.loading}
        >
          Refresh
        </Button>
      </header>
      {activity.loading ? (
        <Skeleton
          active
          paragraph={{
            rows: 8,
          }}
        />
      ) : activity.error ? (
        <Alert
          type="error"
          showIcon
          message="Transactions could not be loaded"
          description={activity.error}
          action={<Button onClick={activity.reload}>Try again</Button>}
        />
      ) : (
        <>
          <TransactionSummary summary={activity.summary} />
          <TransactionFilters
            filters={activity.filters}
            onTextChange={activity.changeText}
            onTypeChange={activity.changeType}
            onClear={activity.clearFilters}
          />
          <p className={styles.results} role="status" aria-live="polite">
            {activity.resultCount}{" "}
            {activity.resultCount === 1 ? "transaction" : "transactions"}
            {hasFilters ? ` out of ${activity.transactions.length}` : ""}
          </p>
          <TransactionsTable
            transactions={activity.pagination.items}
            userId={activity.userId}
            sort={activity.sort}
            onSort={activity.changeSort}
            onDetails={openDetails}
            emptyText={emptyState}
          />
          <ListPagination pagination={activity.pagination} />
          <p className={styles.note}>
            Amounts are the prices recorded at the time of purchase.
          </p>
        </>
      )}
      <TransactionDetails
        transaction={selectedTransaction}
        userId={activity.userId}
        onClose={closeDetails}
      />
    </section>
  );
}
