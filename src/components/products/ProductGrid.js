import { Card, Col, Row, Skeleton } from "antd";
import ProductCard from "@/components/products/ProductCard";

export default function ProductGrid({ products, loading = false }) {
  return (
    <Row gutter={[20, 20]} aria-busy={loading}>
      {loading
        ? Array.from({ length: 4 }, (_, index) => (
            <Col key={index} xs={24} sm={12} lg={8} xl={6}>
              <Card>
                <Skeleton active paragraph={{ rows: 5 }} />
              </Card>
            </Col>
          ))
        : products.map((product) => (
            <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
              <ProductCard product={product} />
            </Col>
          ))}
    </Row>
  );
}
