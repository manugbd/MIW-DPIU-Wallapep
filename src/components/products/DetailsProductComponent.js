import SellerReputation from "@/components/users/SellerReputation";
import PurchaseModal from "@/components/transactions/PurchaseModal";
import Head from "next/head";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  Col,
  Image,
  Modal,
  Row,
  Skeleton,
  Tag,
} from "antd";
import { ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductPurchase } from "@/hooks/useProductPurchase";
import UserIdentity from "@/components/users/UserIdentity";
import {
  formatProductPrice,
  getProductImageUrl,
} from "@/utils/UtilsProductDisplay";
import styles from "@/styles/ProductDetails.module.css";

export default function DetailsProductComponent({ id }) {

  const details = useProductDetails(id);

  const { product } = details;
  
  const purchase = useProductPurchase({
    product,
    onPurchased: details.markPurchased,
    onRefresh: details.refresh,
  });
  
  return (
    <section className={styles.page} aria-label="Product details">
      <Link href="/products" className={styles.backLink}>
        <ArrowLeftOutlined /> Back to products
      </Link>
      {details.loading ? (
        <Card>
          <Skeleton
            active
            paragraph={{
              rows: 6,
            }}
          />
        </Card>
      ) : details.error ? (
        <Alert
          type="error"
          showIcon
          message="Product could not be loaded"
          description={details.error}
          action={<Button onClick={details.refresh}>Try again</Button>}
        />
      ) : (
        product && (
          <>
            <Head>
              <title>{product.title} | Wallapep</title>
            </Head>

            {purchase.transactionId && (
              <Alert
                className={styles.feedback}
                type="success"
                showIcon
                role="status"
                message="Purchase complete"
                action={
                  <Link href="/myTransactions">View my transactions</Link>
                }
                description={`You bought ${product.title} for ${formatProductPrice(product.price)}. Your transaction reference is #${purchase.transactionId}.`}
              />
            )}
            {purchase.error && !purchase.confirmOpen && (
              <Alert
                className={styles.feedback}
                type="error"
                showIcon
                role="alert"
                message="Purchase could not be completed"
                description={purchase.error}
              />
            )}

            <Card>
              <Row gutter={[32, 24]}>
                <Col xs={24} md={10}>
                  <Image
                    src={getProductImageUrl(product.id)}
                    alt={product.title}
                    fallback="/imageMockup.png"
                    width="100%"
                    style={{
                      maxHeight: 420,
                      objectFit: "contain",
                    }}
                  />
                </Col>

                <Col xs={24} md={14}>
                  <div className={styles.tags}>
                    <Tag>{product.category || "Uncategorised"}</Tag>
                    {product.buyerId != null && <Tag>Sold</Tag>}
                  </div>

                  <h1 className={styles.title}>{product.title}</h1>
                  <p className={styles.price}>
                    {formatProductPrice(product.price)}
                  </p>
                  <div
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <p
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      Seller
                    </p>
                    <UserIdentity id={product.sellerId} />
                    <p>
                      <SellerReputation id={product.sellerId} />
                    </p>
                  </div>
                  <h2 className={styles.descriptionHeading}>Description</h2>
                  <p className={styles.description}>
                    {product.description || "No description provided."}
                  </p>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ShoppingOutlined />}
                    disabled={
                      !purchase.availability.available ||
                      Boolean(purchase.transactionId)
                    }
                    loading={purchase.purchasing}
                    onClick={purchase.openConfirmation}
                  >
                    {purchase.availability.label}
                  </Button>

                  {!purchase.transactionId && purchase.availability.reason && (
                    <p className={styles.reason}>
                      {purchase.availability.reason}
                    </p>
                  )}
                </Col>
              </Row>
            </Card>

            {purchase.confirmOpen && (
              <PurchaseModal product={product} purchase={purchase} />
            )}
          </>
        )
      )}
    </section>
  );
}
