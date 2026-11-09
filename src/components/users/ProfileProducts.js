import Link from "next/link";
import { Button, Empty } from "antd";
import ProductGrid from "@/components/products/ProductGrid";
import ListPagination from "@/components/ListPagination";
import { usePagination } from "@/hooks/usePagination";

export default function ProfileProducts({ products, userId }) {
  const pagination = usePagination(products, {
    resetKey: userId,
  });

  if (!products.length)
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No products for sale right now."
      >
        <Link href="/products">
          <Button>Browse products</Button>
        </Link>
      </Empty>
    );

  return (
    <>
      <ProductGrid products={pagination.items} />
      <ListPagination pagination={pagination} />
    </>
  );
}
