export interface AuthTokens {
  token: string;
  expiration: string;
  refreshToken: string;
}

const KEY = "auth";
export const AUTH_EVENT = "auth-changed";

const notify = () => window.dispatchEvent(new Event(AUTH_EVENT));

export const tokenStorage = {
  get(): AuthTokens | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthTokens) : null;
    } catch {
      return null;
    }
  },
  set(tokens: AuthTokens) {
    localStorage.setItem(KEY, JSON.stringify(tokens));
    notify();
  },
  clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem("userData");
    notify();
  },
};