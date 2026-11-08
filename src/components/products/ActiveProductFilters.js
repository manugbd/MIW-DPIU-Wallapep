import { Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getActiveProductFilters } from "@/utils/UtilsProductFilters";
import styles from "@/styles/Products.module.css";

export default function ActiveProductFilters({ filters, onRemove }) {
  const tags = getActiveProductFilters(filters);
  if (!tags.length) return null;
  return (
    <div className={styles.activeFilters} aria-label="Active filters">
      <span>Active filters:</span>
      {tags.map((tag) => (
        <Tag
          key={tag.key}
          closable
          onClose={() => onRemove(tag.key)}
          closeIcon={
            <CloseOutlined
              aria-label={`Remove ${tag.label} filter`}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRemove(tag.key);
                }
              }}
            />
          }
        >
          {tag.label}
        </Tag>
      ))}
    </div>
  );
}
