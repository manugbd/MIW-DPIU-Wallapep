import ProductRowActions from "@/components/products/ProductRowActions";
import styles from "@/styles/MyProducts.module.css";
import { useMyProducts } from "@/hooks/useMyProducts";
import PriceInput from "@/components/forms/PriceInput";
import Link from "next/link";
import {
  Alert,
  Button,
  Input,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from "antd";
import { ShopOutlined, PlusOutlined } from "@ant-design/icons";
import { formatMoney, formatDate } from "@/utils/UtilsFormat";
import { PRODUCT_CATEGORY_OPTIONS } from "@/models/ProductCategories";
import UserIdentity from "@/components/users/UserIdentity";

export default function ListMyProductsComponent() {

  const {
    products,
    loading,
    error,
    text,
    setText,
    category,
    setCategory,
    status,
    setStatus,
    editing,
    setEditing,
    price,
    setPrice,
    saving,
    load,
    filtered,
    save,
    remove,
  } = useMyProducts();

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: true,
      render: (title, p) => (
        <Link href={`/detailProduct/${p.id}`}>{title}</Link>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => String(a.category).localeCompare(String(b.category)),
      responsive: ["md"],
    },
    {
      title: "Status",
      key: "status",
      sorter: (a, b) => Number(a.buyerId != null) - Number(b.buyerId != null),
      render: (_, p) => (
        <Tag color={p.buyerId != null ? "default" : "green"}>
          {p.buyerId != null ? "Sold" : "For sale"}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      align: "right",
      sorter: (a, b) => Number(a.price) - Number(b.price),
      render: (value, p) =>
        editing === p.id ? (
          <Space>
            <PriceInput
              aria-label="New price in euros"
              value={price}
              onChange={setPrice}
            />
            <Button loading={saving} onClick={() => save(p)}>
              Save
            </Button>
            <Button disabled={saving} onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            {formatMoney(value)}
            {p.buyerId == null && (
              <Button
                size="small"
                onClick={() => {
                  setEditing(p.id);
                  setPrice(Number(value));
                }}
              >
                Change price
              </Button>
            )}
          </Space>
        ),
    },
    {
      title: "Listed",
      dataIndex: "date",
      sorter: (a, b) => Number(a.date) - Number(b.date),
      render: formatDate,
      responsive: ["lg"],
    },
    {
      title: "Buyer",
      key: "buyer",
      responsive: ["lg"],
      render: (_, p) =>
        p.buyerId != null ? (
          <UserIdentity
            id={p.buyerId}
            name={p.buyerName}
            email={p.buyerEmail}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 144,
      align: "right",
      render: (_, product) => (
        <ProductRowActions product={product} onDelete={remove} />
      ),
    },
  ];

  const sold = products.filter((p) => p.buyerId != null);

  return (
    <section>
      <header className={styles.heading}>
        <h1><ShopOutlined /> My products</h1>
        <Link href="/createProduct">
          <Button type="primary" icon={<PlusOutlined />}>Add product</Button>
        </Link>
      </header>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          action={<Button onClick={load}>Refresh</Button>}
        />
      )}
      
      <Space
        wrap
        style={{
          marginBlock: 24,
        }}
        size="large"
      >
        <Statistic title="For sale" value={products.length - sold.length} />
        <Statistic title="Sold" value={sold.length} />
        <Statistic
          title="Current value for sale"
          value={formatMoney(
            products
              .filter((p) => p.buyerId == null)
              .reduce((sum, p) => sum + Number(p.price || 0), 0),
          )}
        />
      </Space>

      <Space
        wrap
        style={{
          display: "flex",
          marginBottom: 16,
        }}
      >
        <Input.Search
          aria-label="Search my products"
          placeholder="Search title or description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          allowClear
          style={{
            width: 260,
          }}
        />

        <Select
          aria-label="Category"
          value={category}
          onChange={setCategory}
          options={PRODUCT_CATEGORY_OPTIONS}
          allowClear
          placeholder="All categories"
          style={{
            width: 180,
          }}
        />

        <Select
          aria-label="Sale status"
          value={status}
          onChange={setStatus}
          options={[
            {
              value: "all",
              label: "All products",
            },
            {
              value: "available",
              label: "For sale",
            },
            {
              value: "sold",
              label: "Sold",
            },
          ]}
        />

        <Button
          onClick={() => {
            setText("");
            setCategory(undefined);
            setStatus("all");
          }}
        >
          Clear filters
        </Button>
      </Space>

      <p role="status">
        {filtered.length} products out of {products.length}
      </p>
      
      <Table
        className={styles.table}
        sticky
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        scroll={{
          x: "max-content",
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `${total} products`,
        }}
      />
    </section>
  );
}
