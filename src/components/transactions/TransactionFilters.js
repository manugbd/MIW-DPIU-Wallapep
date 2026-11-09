import { Button, Col, Form, Input, Row, Segmented } from "antd";
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
          <Col xs={24} lg={12}>
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
          <Col xs={24} sm={16} lg={8}>
            <Form.Item label="Activity" htmlFor="transaction-type">
              <Segmented
                block
                id="transaction-type"
                value={filters.type}
                onChange={onTypeChange}
                options={TRANSACTION_TYPE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} lg={4}>
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
