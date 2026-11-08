export const PRODUCT_CATEGORIES = [
  "Electrónica",
  "Hogar",
  "Moda",
  "Deporte",
  "Juguetes",
  "Libros",
  "Otros",
];

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

export const isProductCategory = (category) =>
  PRODUCT_CATEGORIES.includes(category);
