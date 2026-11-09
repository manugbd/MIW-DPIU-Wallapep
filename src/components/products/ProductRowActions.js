import Link from "next/link";
import { Button, Tooltip } from "antd";
import { RightOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "@/styles/MyProducts.module.css";

export default function ProductRowActions({ product, onDelete }) {
  return (
    <div className={styles.rowActions}>
      <Tooltip title="View product">
        <Link
          href={`/detailProduct/${product.id}`}
          aria-label={`View ${product.title}`}
          className={styles.iconLink}
        >
          <RightOutlined />
        </Link>
      </Tooltip>
      {product.buyerId == null && (
        <>
          <Tooltip title="Edit product">
            <Link
              href={`/editProduct/${product.id}`}
              aria-label={`Edit ${product.title}`}
              className={styles.iconLink}
            >
              <EditOutlined />
            </Link>
          </Tooltip>
          <Tooltip title="Delete product">
            <Button
              type="text"
              danger
              onClick={() => onDelete(product.id)}
              icon={<DeleteOutlined />}
              aria-label={`Delete ${product.title}`}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
}
