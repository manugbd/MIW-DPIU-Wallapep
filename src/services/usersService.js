const toCreateUserPayload = (values) => ({
  email: values.email.trim(),
  password: values.password,
  name: values.name?.trim() || null,
  surname: values.surname?.trim() || null,
  birthday: values.birthday ? values.birthday.startOf("day").valueOf() : null,
  documentIdentity: values.documentIdentity || null,
  documentNumber: values.documentNumber?.trim().toUpperCase() || null,
  country: values.country || null,
  address: values.address?.trim() || null,
  postalCode: values.postalCode?.trim() || null,
});

export const registerUser = async (values) => {
  let response;
  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toCreateUserPayload(values)),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Comprueba que está iniciado e inténtalo de nuevo.");
  }

  let body;
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (response.ok) return body;

  const errors = Array.isArray(body.errors) ? body.errors : [];
  const fieldErrors = {};
  const messages = [];
  errors.forEach((error) => {
    if (error.msg?.toLowerCase().includes("email already in use")) {
      fieldErrors.email = "Este correo ya está registrado.";
    } else if (error.field) {
      fieldErrors[error.field] = error.msg || "Revisa este dato.";
    } else if (error.msg) {
      messages.push(error.msg);
    }
  });

  const error = new Error(
    messages.join(" ") || (Object.keys(fieldErrors).length
      ? "Hay datos que necesitan tu atención. Revisa los campos señalados."
      : "No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo.")
  );
  error.fieldErrors = fieldErrors;
  throw error;
};
