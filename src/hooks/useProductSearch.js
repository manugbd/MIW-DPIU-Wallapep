import { DEFAULT_PRODUCT_SORT, sortProducts } from "@/utils/UtilsProductSort";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getProducts } from "@/services/productsService";
import { usePagination } from "@/hooks/usePagination";
import {
  EMPTY_PRODUCT_FILTERS,
  DEFAULT_PRODUCT_FILTERS,
  filterProducts,
  getCategoryFilterOptions,
  getProductFilterQuery,
  getProductFiltersFromQuery,
} from "@/utils/UtilsProductFilters";

export const useProductSearch = () => {
  const router = useRouter();

  const [sort, setSort] = useState(DEFAULT_PRODUCT_SORT);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const filters = useMemo(
    () => getProductFiltersFromQuery(router.query),
    [router.query],
  );

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    getProducts(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setProducts(data.filter((product) => product.buyerId == null));
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [revision]);

  const results = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    [products, filters, sort],
  );

  const categoryOptions = useMemo(
    () => getCategoryFilterOptions(products),
    [products],
  );

  const pagination = usePagination(results, {
    resetKey: `${JSON.stringify(filters)}|${sort}`,
  });

  const applyFilters = useCallback(
    (values) => {
      const query = {
        ...router.query,
      };

      ["title", "category", "minPrice", "maxPrice"].forEach(
        (key) => delete query[key],
      );

      return router.replace(
        {
          pathname: router.pathname,
          query: {
            ...query,
            ...getProductFilterQuery(values),
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
    },
    [router],
  );

  const clearFilters = () => applyFilters(DEFAULT_PRODUCT_FILTERS);

  const removeFilter = (key) =>
    applyFilters({
      ...filters,
      [key]: EMPTY_PRODUCT_FILTERS[key],
    });

  const retry = () => setRevision((value) => value + 1);
  
  return {
    filters,
    sort,
    setSort,
    categoryOptions,
    visibleProducts: pagination.items,
    total: products.length,
    resultCount: results.length,
    loading: loading || !router.isReady,
    error,
    pagination,
    applyFilters,
    clearFilters,
    removeFilter,
    retry,
  };
};
