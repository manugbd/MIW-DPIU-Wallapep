import { Button, Col, Form, Input, Row, Select } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { TRANSACTION_TYPE_OPTIONS } from "@/utils/UtilsTransactions";
import styles from "@/styles/Transactions.module.css";

export default function TransactionFilters({
  filters,
  onTextChange,
  onTypeChange,
  onClear,
}) {
  return (
    <div className={styles.filters}>
      <Form layout="vertical" component="div">
        <Row gutter={16} align="bottom">
          <Col xs={24} md={14}>
            <Form.Item label="Search transactions" htmlFor="transaction-search">
              <Input
                id="transaction-search"
                value={filters.text}
                onChange={onTextChange}
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search by product or reference"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={6}>
            <Form.Item label="Activity" htmlFor="transaction-type">
              <Select
                id="transaction-type"
                value={filters.type}
                onChange={onTypeChange}
                options={TRANSACTION_TYPE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Form.Item>
              <Button block icon={<ClearOutlined />} onClick={onClear}>
                Clear filters
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
