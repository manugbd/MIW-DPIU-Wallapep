import { useRouter } from "next/router";
import { isProductSurfaceClick } from "@/utils/UtilsProductNavigation";
import { useState } from "react";
import Link from "next/link";
import { Alert, Button, Card } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useProductPurchase } from "@/hooks/useProductPurchase";
import PurchaseModal from "@/components/transactions/PurchaseModal";
import {
  formatProductPrice,
  getProductImageUrl,
} from "@/utils/UtilsProductDisplay";
import styles from "@/styles/Products.module.css";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false), [sold, setSold] = useState(false);
    
  const purchase = useProductPurchase({
    product: sold
      ? {
          ...product,
          buyerId: true,
        }
      : product,
    onPurchased: () => setSold(true),
    onRefresh: () => setSold(true),
  });
  
  return (
    <Card
      className={styles.productCard}
      hoverable
      onClick={(event) => {
        if (isProductSurfaceClick(event)) void router.push(`/detailProduct/${product.id}`);
      }}
      cover={
        <Link href={`/detailProduct/${product.id}`}>
          <img
            src={
              imageFailed ? "/imageMockup.png" : getProductImageUrl(product.id)
            }
            alt={product.title || "Product"}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className={styles.productImage}
          />
        </Link>
      }
    >
      <p className={styles.productCategory}>{product.category || "Other"}</p>
      <h2 className={styles.productTitle}>
        <Link href={`/detailProduct/${product.id}`}>
          {product.title || "Untitled product"}
        </Link>
      </h2>
      <p className={styles.productPrice}>{formatProductPrice(product.price)}</p>
      <p className={styles.productDescription}>
        {product.description || "No description provided."}
      </p>

      {purchase.transactionId ? (
        <Alert
          type="success"
          showIcon
          message={
            <Link href="/myTransactions">
              Purchase complete · View transaction
            </Link>
          }
        />
      ) : (
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          block
          disabled={!purchase.availability.available}
          onClick={purchase.openConfirmation}
        >
          {purchase.availability.label}
        </Button>
      )}
      {!purchase.availability.available && (
        <p>
          {purchase.availability.label === "Sign in to buy" ? (
            <Link href="/login">Sign in to buy</Link>
          ) : (
            purchase.availability.reason
          )}
        </p>
      )}
      {purchase.error && !purchase.confirmOpen && (
        <Alert type="error" message={purchase.error} />
      )}
      {purchase.confirmOpen && (
        <PurchaseModal product={product} purchase={purchase} />
      )}
    </Card>
  );
}
