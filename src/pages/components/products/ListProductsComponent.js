import Link from "next/link";
import { Alert, Button, Empty } from "antd";
import ListPagination from "@/components/ListPagination";
import ProductFilters from "@/components/products/ProductFilters";
import ActiveProductFilters from "@/components/products/ActiveProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { useProductSearch } from "@/hooks/useProductSearch";
import { getActiveProductFilters } from "@/utils/UtilsProductFilters";
import styles from "@/styles/Products.module.css";

export default function ListProductsComponent() {
  const search = useProductSearch();
  const hasFilters = getActiveProductFilters(search.filters).length > 0;

  return (
    <section className={styles.page} aria-labelledby="products-heading">
      <header className={styles.heading}>
        <h1 id="products-heading">Products</h1>
        <p>Find your next second-hand discovery.</p>
      </header>

      <ProductFilters
        filters={search.filters}
        categoryOptions={search.categoryOptions}
        onSearch={search.applyFilters}
        onReset={search.clearFilters}
      />

      <ActiveProductFilters
        filters={search.filters}
        onRemove={search.removeFilter}
      />

      {search.error ? (
        <Alert
          className={styles.feedback}
          type="error"
          showIcon
          message="Products could not be loaded"
          description={search.error}
          action={<Button onClick={search.retry}>Try again</Button>}
        />
      ) : search.loading ? (
        <>
          <p role="status" className={styles.resultsSummary}>
            Loading products…
          </p>
          <ProductGrid products={[]} loading />
        </>
      ) : (
        <>
          <p role="status" aria-live="polite" className={styles.resultsSummary}>
            {search.resultCount}{" "}
            {search.resultCount === 1 ? "product" : "products"} found
            {search.resultCount !== search.total
              ? ` out of ${search.total}`
              : ""}
          </p>
          
          {search.resultCount > 0 ? (
            <>
              <ProductGrid products={search.visibleProducts} />
              <ListPagination pagination={search.pagination} />
            </>
          ) : (
            <div className={styles.empty}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  hasFilters || search.total > 0
                    ? "No products match your search. Try a broader title, another category or a wider price range."
                    : "No products have been listed yet."
                }
              >
                {hasFilters || search.total > 0 ? (
                  <Button type="primary" onClick={search.clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/createProduct">
                    <Button type="primary">Sell a product</Button>
                  </Link>
                )}
              </Empty>
            </div>
          )}
        </>
      )}
    </section>
  );
}
