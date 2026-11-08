export const buyProduct = async (productId) => {
  let response;
  
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: localStorage.getItem("apiKey"),
        },
        body: JSON.stringify({ productId }),
      },
    );
  } catch {
    throw new Error(
      "Could not reach the server. Check your connection before trying again.",
    );
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const messages = Array.isArray(body.errors)
      ? body.errors.map((error) => error.msg).filter(Boolean)
      : [];

    const error = new Error(
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : messages.join(" ") ||
            "Your purchase could not be completed. Please try again.",
    );

    error.status = response.status;
    throw error;
  }

  if (body.affectedRows !== 1 || !body.insertId)
    throw new Error("The purchase could not be confirmed. Reload the product before trying again.");

  return body;
};
