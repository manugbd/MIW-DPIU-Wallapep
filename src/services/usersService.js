
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

const publicUsers = new Map();

const USER_CACHE_TIME = 60000;

const fetchPublicUser = async (id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/${encodeURIComponent(id)}`,
  );
  const user = await response.json().catch(() => null);

  if (!response.ok || !user?.id)
    throw new Error("This user profile could not be loaded.");

  return user;
};

export const getPublicUser = (id, { force = false } = {}) => {
  const key = String(id);
  const cached = publicUsers.get(key);

  if (cached && (cached.pending || (!force && cached.expires > Date.now())))
    return cached.promise;

  const entry = {
    pending: true,
    expires: 0,
  };

  entry.promise = fetchPublicUser(id)
    .then((user) => {
      entry.pending = false;
      entry.expires = Date.now() + USER_CACHE_TIME;
      return user;
    })
    .catch((error) => {
      if (publicUsers.get(key) === entry) publicUsers.delete(key);
      throw error;
    });

  publicUsers.set(key, entry);

  return entry.promise;
};
export const registerUser = async (values) => {
  let response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toCreateUserPayload(values)),
    });
  } catch {
    throw new Error("Could not connect to the server. Check that it is running and try again.");
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
      fieldErrors.email = "This email address is already registered.";
    } else if (error.field) {
      fieldErrors[error.field] = error.msg || "Check this value.";
    } else if (error.msg) {
      messages.push(error.msg);
    }
  });

  const error = new Error(
    messages.join(" ") ||
      (Object.keys(fieldErrors).length
        ? "Some details need your attention. Review the highlighted fields."
        : "Your account could not be created. Check your details and try again."),
  );

  error.fieldErrors = fieldErrors;

  throw error;
};
export const loginUser = async (values) => {
  let response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email.trim(),
        password: values.password,
      }),
    });
  } catch {
    throw new Error("Could not reach the server. Try again.");
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.apiKey)
    throw new Error(
      (body.errors || []).map((error) => error.msg).join(" ") ||
        "Sign in failed. Check your email and password.",
    );

  localStorage.setItem("apiKey", body.apiKey);
  localStorage.setItem("email", body.email);

  return body;
};
