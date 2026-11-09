export const getCheckoutDefaults = async (signal) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/own`,
    {
      signal,
      headers: {
        apikey: localStorage.getItem("apiKey"),
      },
    },
  );

  if (!response.ok)
    throw new Error("Your saved address could not be loaded. Enter the delivery address below.");

  return response.json();
};
