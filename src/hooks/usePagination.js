import { useMemo, useState } from "react";

export const usePagination = (items, { initialPageSize = 12, resetKey } = {}) => {
  const [state, setState] = useState({ page: 1, pageSize: initialPageSize, resetKey });
  const pageCount = Math.max(1, Math.ceil(items.length / state.pageSize));
  const page = state.resetKey === resetKey ? Math.min(state.page, pageCount) : 1;
  const pageItems = useMemo(() => items.slice((page - 1) * state.pageSize, page * state.pageSize),
    [items, page, state.pageSize]);

  const changePage = (nextPage, nextSize = state.pageSize) => setState({
    page: nextSize !== state.pageSize ? 1 : nextPage,
    pageSize: nextSize,
    resetKey,
  });

  return { 
    page,
    pageSize: state.pageSize,
    total: items.length,
    items: pageItems,
    changePage
  };
};
