import { Card, Col, Row } from "antd";
import { ShoppingOutlined, ShopOutlined } from "@ant-design/icons";
import { formatTransactionAmount } from "@/utils/UtilsTransactions";
import styles from "@/styles/Transactions.module.css";

export default function TransactionSummary({ summary }) {
  return (
    <section aria-label="All-time activity" className={styles.summary}>
      <p className={styles.summaryLabel}>All-time activity</p>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card>
            <h2 className={styles.summaryTitle}>
              <ShoppingOutlined /> Purchases
            </h2>
            <p className={styles.summaryCount}>{summary.purchases}</p>
            <p className={styles.muted}>
              Total spent:{" "}
              <strong>{formatTransactionAmount(summary.spent)}</strong>
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <h2 className={styles.summaryTitle}>
              <ShopOutlined /> Sales
            </h2>
            <p className={styles.summaryCount}>{summary.sales}</p>
            <p className={styles.muted}>
              Total earned:{" "}
              <strong>{formatTransactionAmount(summary.earned)}</strong>
            </p>
          </Card>
        </Col>
      </Row>
      {summary.missingPrices > 0 && (
        <p className={styles.note}>
          Totals include recorded amounts only. Some older transactions have no
          recorded price.
        </p>
      )}
    </section>
  );
}
