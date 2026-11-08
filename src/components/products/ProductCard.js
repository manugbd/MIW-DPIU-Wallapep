import { useState } from "react";
import Link from "next/link";
import { Card } from "antd";
import {
  formatProductPrice,
  getProductImageUrl,
} from "@/utils/UtilsProductDisplay";
import styles from "@/styles/Products.module.css";

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const handleImageError = () => setImageFailed(true);
  
  return (
    <Link href={`/detailProduct/${product.id}`} className={styles.productLink}>
      <Card
        hoverable
        className={styles.productCard}
        cover={
          <img
            src={
              imageFailed ? "/imageMockup.png" : getProductImageUrl(product.id)
            }
            alt={product.title || "Product"}
            loading="lazy"
            onError={handleImageError}
            className={styles.productImage}
          />
        }
      >
        <p className={styles.productCategory}>
          {product.category || "Uncategorised"}
        </p>
        <h2 className={styles.productTitle}>
          {product.title || "Untitled product"}
        </h2>
        <p className={styles.productPrice}>
          {formatProductPrice(product.price)}
        </p>
        <p className={styles.productDescription}>
          {product.description || "No description provided."}
        </p>
      </Card>
    </Link>
  );
}
