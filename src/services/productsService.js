const productRequest = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}`,
      {
        ...options,
        headers: { ...options.headers, apikey: localStorage.getItem("apiKey") },
      },
    );
  } catch {
    throw new Error(
      "Could not reach the server. Check your connection and try again.",
    );
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errors = Array.isArray(body.errors) ? body.errors : [];
    const error = new Error(
      errors
        .filter((item) => !item.field)
        .map((item) => item.msg)
        .filter(Boolean)
        .join(" ") ||
        "Could not save your changes. Review the highlighted fields and try again.",
    );
    error.fieldErrors = errors
      .filter((item) => item.field)
      .map((item) => ({
        name: item.field,
        errors: [item.msg || "Check this value."],
      }));
    throw error;
  }

  return body;
};

export const createProduct = (values) =>
  productRequest("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: values.title.trim(),
      description: values.description?.trim() || "",
      price: values.price ?? null,
      category: values.category,
    }),
  });

export const uploadProductImage = (productId, image) => {
  const body = new FormData();

  body.append("image", image);

  return productRequest(`/products/${productId}/image`, {
    method: "POST",
    body,
  });
};
