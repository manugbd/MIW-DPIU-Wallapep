import { useCallback, useEffect, useRef } from "react";
import { Form } from "antd";
import {
  DEFAULT_PRODUCT_FILTERS,
  hasInvalidPriceRange,
} from "@/utils/UtilsProductFilters";

export const useProductFilterForm = ({ filters, onSearch, onReset }) => {
  const [form] = Form.useForm();
  const timer = useRef(null);
  const revision = useRef(0);

  const cancelPendingSearch = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    revision.current += 1;
  }, []);

  useEffect(() => {
    cancelPendingSearch();
    form.setFieldsValue(filters);
    if (hasInvalidPriceRange(filters))
      form.validateFields(["maxPrice"]).catch(() => {});
  }, [filters, form, cancelPendingSearch]);

  useEffect(() => cancelPendingSearch, [cancelPendingSearch]);

  const applyValidFilters = async (currentRevision) => {
    try {
      const values = await form.validateFields();
      if (revision.current === currentRevision) await onSearch(values);
    } catch {
      // Form displays invalid fields; outdated drafts are not applied.
    }
  };

  const changeFilters = (changedValues) => {
    cancelPendingSearch();
    const currentRevision = revision.current;
    if (Object.hasOwn(changedValues, "category")) {
      applyValidFilters(currentRevision);
    } else {
      timer.current = setTimeout(
        () => applyValidFilters(currentRevision),
        700,
      );
    }
  };

  const submitNow = (values) => {
    cancelPendingSearch();
    return onSearch(values);
  };

  const resetFilters = () => {
    cancelPendingSearch();
    form.resetFields();
    form.setFieldsValue(DEFAULT_PRODUCT_FILTERS);
    return onReset();
  };

  return { form, changeFilters, resetFilters, submitNow };
};
