import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import accountService from "../services/accountService";
import { AUTH_EVENT, tokenStorage } from "../services/tokenStorage";

export interface AuthUser {
  email: string;
  role: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  photo: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: typeof accountService.login;
  logout: () => Promise<void>;
}

const CLAIM = {
  name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  phone: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone",
};


const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const readUser = (): AuthUser | null => {
  const tokens = tokenStorage.get();
  if (!tokens) return null;
  const c = decodeJwt(tokens.token);
  if (!c) return null;
  return {
    email: c[CLAIM.name] ?? "",
    role: c[CLAIM.role] ?? "",
    phone: c[CLAIM.phone] ?? "",
    firstName: c.FirstName ?? "",
    lastName: c.LastName ?? "",
    address: c.Address ?? "",
    photo: c.Photo ?? "",
  };
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser);

  
  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync); 
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: accountService.login,
      logout: accountService.logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}