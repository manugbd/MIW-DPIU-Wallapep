const cardRequest = async (method, body, signal) => {
  let response;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/creditCards`,
      {
        method,
        signal,
        headers: {
          apikey: localStorage.getItem("apiKey"),
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Could not reach the server. Please try again.");
  }
  
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errors = Array.isArray(result.errors) ? result.errors : [];

    const error = new Error(
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : errors.map((item) => item.msg).join(" ") ||
            "Your card could not be saved. Please try again.",
    );

    error.fieldErrors = errors
      .filter((item) => item.field)
      .map((item) => ({ name: item.field, errors: [item.msg] }));

    throw error;
  }
  return result;
};

export const getCreditCards = async (signal) => {
  const cards = await cardRequest("GET", null, signal);

  if (!Array.isArray(cards))
    throw new Error("Saved cards could not be loaded.");

  return cards;
};

export const createCreditCard = async (values) => {
  const result = await cardRequest("POST", values);

  if (!result.insertId || result.affectedRows !== 1)
    throw new Error("Your card could not be saved. Please try again.");
  
  return result.insertId;
};
