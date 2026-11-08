export const DEFAULT_PRODUCT_CATEGORY = "Other";

export const PRODUCT_CATEGORIES = [
  "Books",
  "Electronics",
  "Fashion",
  "Home",
  "Other",
  "Sports",
  "Toys",
].sort((first, second) => {
  if (first === second) return 0;
  if (first === DEFAULT_PRODUCT_CATEGORY) return -1;
  if (second === DEFAULT_PRODUCT_CATEGORY) return 1;
  return first.localeCompare(second, "en");
});

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

export const isProductCategory = (category) =>
  PRODUCT_CATEGORIES.includes(category);
