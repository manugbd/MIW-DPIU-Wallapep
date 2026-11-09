import dayjs from "dayjs";
import { formatDate } from "@/utils/UtilsFormat";

export const dateFormatTemplate = "DD/MM/YYYY HH:mm";

export const timestampToString = formatDate;

export const timestampToDate = (value) => dayjs(Number(value));

export const MONTH_INPUT_FORMAT = "MM/YYYY";

export const BIRTHDAY_INPUT_FORMATS = ["D/M/YYYY", "DD/MM/YYYY"];
