import Link from "next/link";
import {
  AppstoreOutlined,
  BookOutlined,
  LaptopOutlined,
  SkinOutlined,
  HomeOutlined,
  TrophyOutlined,
  GiftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  PRODUCT_CATEGORIES,
} from "@/models/ProductCategories";
import styles from "@/styles/Home.module.css";

const CATEGORY_ICONS = {
  AppstoreOutlined,
  BookOutlined,
  LaptopOutlined,
  SkinOutlined,
  HomeOutlined,
  TrophyOutlined,
  GiftOutlined,
};

export default function CategoryGrid({ isLoggedIn }) {
  return (
    <div className={styles.categories}>
      {PRODUCT_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.icon] || AppstoreOutlined;
        const href = isLoggedIn
          ? { pathname: "/products", query: { category: category.value } }
          : "/login";

        return (
          <Link key={category.value} href={href} className={styles.category}>
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <div>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </div>
            <ArrowRightOutlined className={styles.arrow} aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
