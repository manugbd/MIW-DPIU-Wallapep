// Used only to adapt the UI. The backend authenticates and authorises purchases.
export const getUserIdFromToken = (token) => {
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encoded));
    
    return payload.id == null ? null : String(payload.id);
  } catch {
    return null;
  }
};
