import { mergePublicTransactions } from "@/utils/UtilsTransactions";

const transactionRequest = async (path, options) => {
  let response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions${path}`, {
      ...options,
      headers: {
        ...options.headers,
        apikey: localStorage.getItem("apiKey"),
      },
    });
  } catch {
    throw new Error(
      "Could not reach the server. Check your connection and try again.",
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
            "The transaction request could not be completed. Please try again.",
    );

    error.status = response.status;
    error.fieldErrors = (body.errors || [])
      .filter((error) => error.field)
      .map((error) => ({
        name: error.field,
        errors: [error.msg],
      }));

    throw error;
  }

  return body;
};
export const buyProduct = async (productId, details) => {
  const transaction = await transactionRequest("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      ...details,
    }),
  });

  if (transaction.affectedRows !== 1 || !transaction.insertId)
    throw new Error("The purchase could not be confirmed. Reload the product before trying again.");

  publicHistory.clear();

  return transaction;
};
export const getOwnTransactions = async (signal) => {
  const transactions = await transactionRequest("/own", {
    method: "GET",
    signal,
  });

  if (!Array.isArray(transactions))
    throw new Error("The server returned an unexpected transaction list.");

  return transactions;
};

const publicHistory = new Map();

export const getPublicTransactions = async (userId, signal) => {
  const cached = publicHistory.get(String(userId));

  if (!signal && cached && cached.expires > Date.now()) return cached.promise;

  const request = (async () => {
    const id = encodeURIComponent(userId);
    const [sales, purchases] = await Promise.all([
      transactionRequest(`/public?sellerId=${id}`, {
        method: "GET",
        signal,
      }),
      transactionRequest(`/public?buyerId=${id}`, {
        method: "GET",
        signal,
      }),
    ]);

    if (!Array.isArray(sales) || !Array.isArray(purchases))
      throw new Error("Public transactions could not be loaded.");

    return mergePublicTransactions(sales, purchases);
  })();

  if (!signal) {
    publicHistory.set(String(userId), {
      expires: Date.now() + 30000,
      promise: request,
    });

    request.catch(() => publicHistory.delete(String(userId)));
  }
  
  return request;
};
