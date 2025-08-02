import AxiosInstance from "../components/AxiosInstance";
import secureLocalStorage from "react-secure-storage";

const authSettings = {
  auth_server: "chat-app",
  client_id: "client"
};

const getOidcStorageKey = () => {
  return `oidc.user:${authSettings.auth_server}:${authSettings.client_id}`;
};

const getOidcInfo = () => {
  const raw = secureLocalStorage.getItem(getOidcStorageKey());
  if (!raw) return null;

  try {
    return JSON.parse(raw.toString());
  } catch {
    return null;
  }
};

export const setTokens = (accessToken) => {
  const oidc = getOidcInfo() || {};
  oidc.user = oidc.user || {};
  oidc.user.token = accessToken;

  secureLocalStorage.setItem(getOidcStorageKey(), JSON.stringify(oidc));
  AxiosInstance.defaults.headers.common["x-access-token"] = accessToken;
};

export const getAuthState = () => {
  return getOidcInfo()?.authState || false;
};

export const getToken = () => {
  return getOidcInfo()?.user?.token || "";
};

export const logout = async (onLogout) => {
  const key = getOidcStorageKey();
  secureLocalStorage.removeItem(key);
  if (onLogout) onLogout();
};

export default {
  setTokens,
  getToken,
  getAuthState,
  logout
};
