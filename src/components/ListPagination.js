import { Pagination } from "antd";
import styles from "@/styles/Pagination.module.css";

const DEFAULT_PAGE_SIZES = [12, 24, 48];
const showTotal = (total, range) => `${range[0]}–${range[1]} of ${total}`;

export default function ListPagination({
  pagination,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}) {
  return (
    <nav className={styles.pagination} aria-label="List pages">
      <Pagination
        current={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={pagination.changePage}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        responsive
        hideOnSinglePage={pagination.total <= Math.min(...pageSizeOptions)}
        showTotal={showTotal}
      />
    </nav>
  );
}
