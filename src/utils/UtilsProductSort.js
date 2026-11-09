export const PRODUCT_SORT_OPTIONS = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const DEFAULT_PRODUCT_SORT = "name-asc";

export const sortProducts = (products, sort = DEFAULT_PRODUCT_SORT) => {
  const direction = sort.endsWith("desc") ? -1 : 1;

  return [...products].sort((a, b) => {
    if (sort.startsWith("name"))
      return (
        direction *
        String(a.title || "").localeCompare(String(b.title || ""), "en", {
          sensitivity: "base",
        })
      );

    const price = (value) =>
      value == null || value === "" || !Number.isFinite(Number(value))
        ? null
        : Number(value);

    const first = price(a.price),
      second = price(b.price);

    if (first === null) return second === null ? 0 : 1;

    if (second === null) return -1;
    
    return direction * (first - second);
  });
};
