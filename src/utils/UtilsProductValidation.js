import { isProductCategory } from "@/models/ProductCategories";

export const PRODUCT_FORM_RULES = {
  title: [
    { required: true, whitespace: true, message: "Enter a product title." },
    {
      min: 5,
      transform: (value) => value?.trim(),
      message: "Use at least 5 characters.",
    },
    { max: 50, message: "Use no more than 50 characters." },
  ],
  price: [
    { required: true, message: "Enter a price in euros." },
    { type: "number", min: 0, message: "The price must be zero or greater." },
  ],
  category: [
    { required: true, message: "Choose a category." },
    {
      validator: (_, value) =>
        !value || isProductCategory(value)
          ? Promise.resolve()
          : Promise.reject(new Error("Choose a category from the list.")),
    },
  ],
};

export const getProductImageError = (file) => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return "Choose a JPG, PNG or WebP image.";
  }

  if (file.size > 5 * 1024 * 1024) return "The image must be 5 MB or smaller.";
  
  return null;
};
