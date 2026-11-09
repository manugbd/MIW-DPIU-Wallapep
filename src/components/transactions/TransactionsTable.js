import Link from "next/link";
import { Button, Dropdown, Table, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import UserIdentity from "@/components/users/UserIdentity";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getTransactionId,
  getTransactionRole,
} from "@/utils/UtilsTransactions";

const getColumns = (userId, sort, onDetails, publicView) => {
  const sortOrder = (field) => (sort.field === field ? sort.order : null);

  return [
    {
      title: "Reference",
      key: "id",
      width: 110,
      fixed: "left",
      sorter: true,
      sortOrder: sortOrder("id"),
      render: (_, row) => `#${getTransactionId(row)}`,
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      width: 230,
      sorter: true,
      sortOrder: sortOrder("title"),
      ellipsis: true,
      render: (title, row) => (
        <Link href={`/detailProduct/${row.productId}`}>
          {title || `Product #${row.productId}`}
        </Link>
      ),
    },
    {
      title: "Activity",
      key: "role",
      width: 140,
      render: (_, row) => {
        const role = getTransactionRole(row, userId);
        return <Tag color={role.color}>{role.label}</Tag>;
      },
    },
    {
      title: "Buyer",
      key: "buyer",
      width: 200,
      responsive: ["lg"],
      render: (_, row) => (
        <UserIdentity
          name={row.buyerName}
          email={row.buyerEmail}
          id={row.buyerId}
        />
      ),
    },
    {
      title: "Seller",
      key: "seller",
      width: 200,
      responsive: ["lg"],
      render: (_, row) => (
        <UserIdentity
          name={row.sellerName}
          email={row.sellerEmail}
          id={row.sellerId}
        />
      ),
    },
    {
      title: "Amount (€)",
      dataIndex: "productPrice",
      key: "productPrice",
      width: 145,
      align: "right",
      sorter: true,
      sortOrder: sortOrder("productPrice"),
      render: formatTransactionAmount,
    },
    {
      title: "Purchase date",
      dataIndex: "startDate",
      key: "startDate",
      width: 190,
      responsive: ["sm"],
      sorter: true,
      sortOrder: sortOrder("startDate"),
      render: formatTransactionDate,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "right",
      render: (_, row) => (
        <Dropdown
          trigger={["hover", "click"]}
          menu={{
            items: [
              {
                key: "product",
                label: <Link href={`/detailProduct/${row.productId}`}>View product</Link>,
              },
              { key: "details", label: "Transaction details", onClick: () => onDetails(row) },
            ],
          }}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            aria-label={`Actions for transaction ${getTransactionId(row)}`}
          />
        </Dropdown>
      ),
    },
  ]
    .filter(
      (column) =>
        !publicView ||
        !["productPrice", "startDate", "actions"].includes(column.key),
    )
    .map((column) =>
      publicView && ["buyer", "seller"].includes(column.key)
        ? {
            ...column,
            responsive: undefined,
          }
        : column,
    );
};

export default function TransactionsTable({
  transactions,
  userId,
  sort,
  onSort,
  onDetails,
  emptyText,
  publicView = false,
}) {
  const columns = getColumns(userId, sort, onDetails, publicView);
  const handleChange = (_, __, sorter) => onSort(sorter);
  
  return (
    <Table
      rowKey={getTransactionId}
      columns={columns}
      dataSource={transactions}
      pagination={false}
      onChange={handleChange}
      scroll={{
        x: "max-content",
      }}
      sticky
      locale={{
        emptyText,
      }}
    />
  );
}
