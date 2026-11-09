import { CalendarOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import {
  formatDate,
  formatFullDate,
  formatRelativeDate,
  parseDisplayDate,
} from "@/utils/UtilsFormat";
import { useDateClock } from "@/hooks/useDateClock";

export default function DateValue({ value }) {
  const now = useDateClock();
  const parsed = parseDisplayDate(value);
  if (!parsed) return <span>Not recorded</span>;
  const fullDate = formatFullDate(value);
  const text = now == null ? formatDate(value) : formatRelativeDate(value, now);
  return (
    <Tooltip title={fullDate}>
      <time
        className="date-value"
        dateTime={parsed.toISOString()}
        tabIndex={0}
        aria-label={text + ". " + fullDate}
      >
        <CalendarOutlined aria-hidden="true" />
        <span>{text}</span>
      </time>
    </Tooltip>
  );
}
