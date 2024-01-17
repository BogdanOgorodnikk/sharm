export const AUTH_TOKEN = "token";

export const getAuthToken = () => {
  return window.localStorage.getItem(AUTH_TOKEN);
};

export const saveAuthToken = (token) => {
  window.localStorage.setItem(AUTH_TOKEN, token);
};

export const destroyAuthToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN);
};

export default {
  AUTH_TOKEN,
  getAuthToken,
  saveAuthToken,
  destroyAuthToken,
};
