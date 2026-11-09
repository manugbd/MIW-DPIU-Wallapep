import styles from "@/styles/Transactions.module.css";
import Link from "next/link";
import { Button, Descriptions, Divider, Modal, Tag, Typography } from "antd";
import UserIdentity from "@/components/users/UserIdentity";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getTransactionId,
  getTransactionRole,
} from "@/utils/UtilsTransactions";

export default function TransactionDetails({ transaction, userId, onClose }) {

  const role = transaction && getTransactionRole(transaction, userId);
  
  return (
    <Modal
      title={
        transaction
          ? `Transaction #${getTransactionId(transaction)}`
          : "Transaction details"
      }
      open={Boolean(transaction)}
      onCancel={onClose}
      width={720}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {transaction && (
        <>
          <Typography.Title level={5} className={styles.detailSectionTitle}>
            Purchase summary
          </Typography.Title>
          <Descriptions
            layout="vertical"
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Product">
              <Link href={`/detailProduct/${transaction.productId}`}>
                {transaction.title || `Product #${transaction.productId}`}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="Your activity">
              <Tag color={role.color}>{role.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount at purchase">
              {formatTransactionAmount(transaction.productPrice)}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {transaction.category || "Not specified"}
            </Descriptions.Item>
          </Descriptions>
          <Divider className={styles.detailDivider} />
          <Typography.Title level={5} className={styles.detailSectionTitle}>
            Participants
          </Typography.Title>
          <Descriptions
            layout="vertical"
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Buyer">
              <UserIdentity
                name={transaction.buyerName}
                email={transaction.buyerEmail}
                id={transaction.buyerId}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Seller">
              <UserIdentity
                name={transaction.sellerName}
                email={transaction.sellerEmail}
                id={transaction.sellerId}
              />
            </Descriptions.Item>
          </Descriptions>
          <Divider className={styles.detailDivider} />
          <Typography.Title level={5} className={styles.detailSectionTitle}>
            Dates and payment
          </Typography.Title>
          <Descriptions
            layout="vertical"
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Purchase date">
              {formatTransactionDate(transaction.startDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Completion date">
              {formatTransactionDate(transaction.endDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Payment reference">
              {transaction.buyerPaymentId != null
                ? `#${transaction.buyerPaymentId}`
                : "No payment method recorded"}
            </Descriptions.Item>
          </Descriptions>
          <Divider className={styles.detailDivider} />
          <Typography.Title level={5} className={styles.detailSectionTitle}>
            Delivery details at purchase
          </Typography.Title>
          <Descriptions
            layout="vertical"
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Country">
              {transaction.buyerCountry || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Postal code">
              {transaction.buyerPostCode ?? "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {transaction.buyerAddress || "Not provided"}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
}
