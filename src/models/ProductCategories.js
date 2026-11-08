export const PRODUCT_CATEGORY_MAP = {
  OTHER: {
    value: "Other",
    icon: "AppstoreOutlined",
    label: "Other",
    description: "Discover items that do not fit into the other categories.",
  },
  BOOKS: {
    value: "Books",
    icon: "BookOutlined",
    label: "Books",
    description: "Novels, textbooks, comics and more stories to discover.",
  },
  ELECTRONICS: {
    value: "Electronics",
    icon: "LaptopOutlined",
    label: "Electronics",
    description: "Phones, computers, consoles and everyday technology.",
  },
  FASHION: {
    value: "Fashion",
    icon: "SkinOutlined",
    label: "Fashion",
    description: "Clothing, shoes and accessories for a new look.",
  },
  HOME: {
    value: "Home",
    icon: "HomeOutlined",
    label: "Home",
    description: "Furniture, decor and useful things for your home.",
  },
  SPORTS: {
    value: "Sports",
    icon: "TrophyOutlined",
    label: "Sports",
    description: "Equipment and accessories for your next activity.",
  },
  TOYS: {
    value: "Toys",
    icon: "GiftOutlined",
    label: "Toys",
    description: "Games, puzzles and toys ready for more playtime.",
  },
};

export const DEFAULT_PRODUCT_CATEGORY = PRODUCT_CATEGORY_MAP.OTHER.value;

export const PRODUCT_CATEGORIES = Object.values(PRODUCT_CATEGORY_MAP).sort(
  (first, second) => {
    if (first.value === second.value) return 0;
    if (first.value === DEFAULT_PRODUCT_CATEGORY) return -1;
    if (second.value === DEFAULT_PRODUCT_CATEGORY) return 1;
    return first.label.localeCompare(second.label, "en");
  },
);

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map(
  ({ label, value }) => ({ label, value }),
);

export const isProductCategory = (category) =>
  PRODUCT_CATEGORIES.some(({ value }) => value === category);

export const getProductsInCategory = (products, category) =>
  isProductCategory(category)
    ? products.filter((product) => product.category === category)
    : products;
