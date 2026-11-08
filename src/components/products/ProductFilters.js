import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { DEFAULT_PRODUCT_FILTERS } from "@/utils/UtilsProductFilters";
import { formatDecimalInput, parseDecimalInput } from "@/utils/UtilsNumbers";
import { useProductFilterForm } from "@/hooks/useProductFilterForm";
import styles from "@/styles/Products.module.css";

export default function ProductFilters({
  filters,
  categoryOptions,
  onSearch,
  onReset,
}) {
  const { form, changeFilters, resetFilters, submitNow } = useProductFilterForm(
    { filters, onSearch, onReset },
  );

  const validateRange = (_, value) => {
    const minimum = form.getFieldValue("minPrice");
    
    return minimum != null && value != null && minimum > value
      ? Promise.reject(
          new Error(
            "Maximum price must be equal to or greater than minimum price.",
          ),
        )
      : Promise.resolve();
  };

  return (
    <Form
      form={form}
      name="product-search"
      layout="vertical"
      className={styles.filterPanel}
      onFinish={submitNow}
      onValuesChange={changeFilters}
      initialValues={DEFAULT_PRODUCT_FILTERS}
      requiredMark={false}
      scrollToFirstError
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="title" label="Search products">
            <Input
              allowClear
              prefix={<SearchOutlined aria-hidden="true" />}
              placeholder="Search by title or description"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="category" label="Category">
            <Select
              showSearch
              optionFilterProp="label"
              options={categoryOptions}
              notFoundContent="No matching categories"
            />
          </Form.Item>
        </Col>
        <Col xs={12} lg={5}>
          <Form.Item name="minPrice" label="Minimum price">
            <InputNumber
              min={0}
              precision={2}
              step={0.01}
              inputMode="decimal"
              addonAfter="€"
              formatter={formatDecimalInput}
              parser={parseDecimalInput}
              placeholder="No minimum"
              className={styles.priceInput}
            />
          </Form.Item>
        </Col>
        <Col xs={12} lg={5}>
          <Form.Item
            name="maxPrice"
            label="Maximum price"
            dependencies={["minPrice"]}
            rules={[{ validator: validateRange }]}
          >
            <InputNumber
              min={0}
              precision={2}
              step={0.01}
              inputMode="decimal"
              addonAfter="€"
              formatter={formatDecimalInput}
              parser={parseDecimalInput}
              placeholder="No maximum"
              className={styles.priceInput}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className={styles.filterActions}>
        <Button
          htmlType="button"
          icon={<ClearOutlined />}
          onClick={resetFilters}
        >
          Clear filters
        </Button>
      </div>
    </Form>
  );
}
