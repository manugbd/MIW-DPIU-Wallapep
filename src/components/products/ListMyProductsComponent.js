import { useEffect, useState } from "react";
import DateValue from "@/components/DateValue";
import { useRouter } from "next/router";
import { isProductSurfaceClick } from "@/utils/UtilsProductNavigation";
import ProductRowActions from "@/components/products/ProductRowActions";
import styles from "@/styles/MyProducts.module.css";
import { useMyProducts } from "@/hooks/useMyProducts";
import PriceInput from "@/components/forms/PriceInput";
import Link from "next/link";
import {
  Alert,
  Button,
  Empty,
  Input,
  Select,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  ShopOutlined,
  PlusOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formatMoney } from "@/utils/UtilsFormat";
import { PRODUCT_CATEGORY_OPTIONS } from "@/models/ProductCategories";
import UserIdentity from "@/components/users/UserIdentity";

export default function ListMyProductsComponent() {
  const router = useRouter();

  const {
    products,
    loading,
    error,
    feedback,
    clearFeedback,
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
    editingField,
    setEditingField,
    title: editedTitle,
    setTitle,
    saving,
    load,
    filtered,
    save,
    remove,
    removeMany,
  } = useMyProducts();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const selectionScope = JSON.stringify([text, category, status]);
  const [selectedScope, setSelectedScope] = useState(selectionScope);
  const selectedIds =
    selectedScope === selectionScope
      ? selectedKeys.filter((id) =>
          filtered.some(
            (product) => product.id === id && product.buyerId == null,
          ),
        )
      : [];
  useEffect(() => {
    setSelectedKeys([]);
    setSelectedScope(selectionScope);
    setCurrentPage(1);
  }, [selectionScope]);

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: true,
      render: (title, p) =>
        editing === p.id && editingField === "title" ? (
          <Space>
            <Input
              aria-label="Product name"
              value={editedTitle}
              maxLength={50}
              onChange={(event) => setTitle(event.target.value)}
              onPressEnter={() => !saving && save(p)}
              autoFocus
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
            <Link href={`/detailProduct/${p.id}`}>{title}</Link>
            {p.buyerId == null && (
              <Button
                type="text"
                className={styles.editAction}
                icon={<EditOutlined />}
                aria-label="Edit product name"
                title="Edit product name"
                onClick={() => {
                  setEditing(p.id);
                  setEditingField("title");
                  setTitle(title);
                }}
              />
            )}
          </Space>
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
        editing === p.id && editingField === "price" ? (
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
                type="text"
                className={styles.editAction}
                icon={<EditOutlined />}
                aria-label="Edit price"
                title="Edit price"
                onClick={() => {
                  setEditing(p.id);
                  setEditingField("price");
                  setPrice(Number(value));
                }}
              />
            )}
          </Space>
        ),
    },
    {
      title: "Listed",
      dataIndex: "date",
      sorter: (a, b) => Number(a.date) - Number(b.date),
      render: (value) => <DateValue value={value} />,
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
  const hasFilters =
    Boolean(text.trim()) || Boolean(category) || status !== "all";
  const clearFilters = () => {
    setText("");
    setCategory(undefined);
    setStatus("all");
  };
  const emptyState = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        error
          ? "Products could not be loaded."
          : hasFilters
            ? "No products match your filters."
            : "You have not listed any products yet."
      }
    >
      {error ? (
        <Button onClick={load}>Try again</Button>
      ) : hasFilters ? (
        <Button onClick={clearFilters}>Clear filters</Button>
      ) : (
        <Link href="/createProduct">
          <Button type="primary" icon={<PlusOutlined />}>
            Add product
          </Button>
        </Link>
      )}
    </Empty>
  );

  return (
    <section>
      <header className={styles.heading}>
        <h1>
          <ShopOutlined /> My products
        </h1>
        <Link href="/createProduct">
          <Button type="primary" icon={<PlusOutlined />}>
            Add product
          </Button>
        </Link>
      </header>

      {feedback && (
        <Alert
          type="success"
          showIcon
          role="status"
          message={feedback}
          closable
          onClose={clearFeedback}
        />
      )}
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
        align="end"
        style={{
          display: "flex",
          marginBottom: 16,
        }}
      >
        <div className={styles.filterField}>
          <label htmlFor="my-products-search">Search products</label>
          <Input.Search
            id="my-products-search"
            aria-label="Search my products"
            placeholder="Search title or description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            allowClear
            style={{
              width: 260,
            }}
          />
        </div>
        <div className={styles.filterField}>
          <label htmlFor="my-products-category">Category</label>
          <Select
            id="my-products-category"
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
        </div>
        <div className={styles.filterField}>
          <span id="my-products-status-label">Status</span>
          <Segmented
            aria-labelledby="my-products-status-label"
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
        </div>
        <Button icon={<ClearOutlined />} onClick={clearFilters}>
          Clear filters
        </Button>
      </Space>

      <p role="status" aria-live="polite">
        {loading
          ? "Loading products..."
          : `${filtered.length} products out of ${products.length}`}
      </p>

      <Space wrap style={{ marginBottom: 16 }}>
        <span role="status" aria-live="polite">
          {selectedIds.length} selected (current page only)
        </span>
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={!selectedIds.length || loading}
          onClick={() => {
            removeMany(selectedIds);
            setSelectedKeys([]);
          }}
        >
          Delete selected
        </Button>
        {!!selectedIds.length && (
          <Button onClick={() => setSelectedKeys([])}>Clear selection</Button>
        )}
      </Space>
      <Table
        rowSelection={{
          selectedRowKeys: selectedIds,
          onCell: () => ({ onClick: (event) => event.stopPropagation() }),
          preserveSelectedRowKeys: false,
          onChange: (keys) => {
            setSelectedScope(selectionScope);
            setSelectedKeys(keys);
          },
          getCheckboxProps: (product) => ({
            disabled: loading || product.buyerId != null,
            "aria-label": "Select " + product.title,
          }),
        }}
        onChange={(pagination) => {
          setSelectedKeys([]);
          setCurrentPage(pagination.current);
          setPageSize(pagination.pageSize);
        }}
        className={styles.table}
        sticky
        rowKey="id"
        onRow={(product) => ({
          style: { cursor: "pointer" },
          onClick: (event) => {
            if (isProductSurfaceClick(event))
              void router.push(`/detailProduct/${product.id}`);
          },
        })}
        loading={loading}
        locale={{ emptyText: emptyState }}
        columns={columns}
        dataSource={filtered}
        scroll={{
          x: "max-content",
        }}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          showTotal: (total) => `${total} products`,
        }}
      />
    </section>
  );
}
