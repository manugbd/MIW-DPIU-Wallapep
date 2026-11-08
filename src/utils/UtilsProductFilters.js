import {isProductCategory, PRODUCT_CATEGORIES} from "@/models/ProductCategories";

export const EMPTY_PRODUCT_FILTERS = {
  title: "",
  category: "",
  minPrice: null,
  maxPrice: null,
};

export const DEFAULT_PRODUCT_FILTERS = {
  ...EMPTY_PRODUCT_FILTERS,
  minPrice: 0,
};

const firstValue = (value) => (Array.isArray(value) ? value[0] : value);
const parsePrice = (value) => {
  const raw = firstValue(value);
  if (raw === null || raw === undefined || raw === "") return null;
  const number = Number(String(raw).replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : null;
};
const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const getProductFiltersFromQuery = (query) => ({
  title: String(firstValue(query.title) ?? "").trim(),
  category: isProductCategory(firstValue(query.category))
    ? firstValue(query.category)
    : "",
  minPrice:
    query.minPrice === undefined
      ? DEFAULT_PRODUCT_FILTERS.minPrice
      : parsePrice(query.minPrice),
  maxPrice: parsePrice(query.maxPrice),
});

export const getProductFilterQuery = (filters) => {
  const query = {};
  if (filters.title?.trim()) query.title = filters.title.trim();
  if (isProductCategory(filters.category)) query.category = filters.category;
  if (filters.minPrice === null) query.minPrice = "";
  else if (
    filters.minPrice !== undefined &&
    filters.minPrice !== DEFAULT_PRODUCT_FILTERS.minPrice
  )
    query.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== null && filters.maxPrice !== undefined)
    query.maxPrice = String(filters.maxPrice);
  return query;
};

export const hasInvalidPriceRange = ({ minPrice, maxPrice }) =>
  minPrice !== null && maxPrice !== null && minPrice > maxPrice;

export const filterProducts = (products, filters) => {
  if (hasInvalidPriceRange(filters)) return [];
  const searchText = normalizeText(filters.title).trim();
  const hasPriceFilter = filters.minPrice !== null || filters.maxPrice !== null;
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (searchText && ![product.title, product.description].some(value => normalizeText(value).includes(searchText))) return false;
    if (!hasPriceFilter) return true;
    if (
      product.price === null ||
      product.price === undefined ||
      product.price === ""
    )
      return false;
    const price = Number(product.price);
    return (
      Number.isFinite(price) &&
      (filters.minPrice === null || price >= filters.minPrice) &&
      (filters.maxPrice === null || price <= filters.maxPrice)
    );
  });
};

export const getCategoryFilterOptions = (products) => [
  { value: "", label: `All categories (${products.length})` },
  ...PRODUCT_CATEGORIES.map(({ value, label }) => ({
    value,
    label: `${label} (${products.filter((product) => product.category === value).length})`,
  })),
];

export const getActiveProductFilters = (filters) => {
  const tags = [];
  if (filters.title)
    tags.push({ key: "title", label: `Search: ${filters.title}` });
  if (filters.category)
    tags.push({ key: "category", label: `Category: ${filters.category}` });
  if (
    filters.minPrice !== null &&
    filters.minPrice !== DEFAULT_PRODUCT_FILTERS.minPrice
  )
    tags.push({
      key: "minPrice",
      label: `Min: ${filters.minPrice.toFixed(2)} €`,
    });
  if (filters.maxPrice !== null)
    tags.push({
      key: "maxPrice",
      label: `Max: ${filters.maxPrice.toFixed(2)} €`,
    });
  return tags;
};
