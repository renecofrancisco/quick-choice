export const AUTH_STATE_CHANGED = "AUTH_STATE_CHANGED";

export const broadcastAuthStateChangeEvent = () => {
  localStorage.setItem(AUTH_STATE_CHANGED, Date.now().toString());
};