import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiClient, setTokenSetter } from "../services/apiClient.js";
import { silentRefresh } from "../services/tokenRefresh.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);
  // True while we're trying to restore the session on page load.
  // ProtectedRoute must NOT redirect until this is false.
  const [isInitializing, setIsInitializing] = useState(true);

  const setAccessToken = useCallback((token) => {
    window.__superstarAccessToken = token ?? null;
    setAccessTokenState(token);
  }, []);

  useEffect(() => {
    setTokenSetter(setAccessToken);
  }, [setAccessToken]);

  // On mount: attempt silent refresh using the httpOnly refresh-token cookie.
  // If it succeeds the user stays logged in; if it fails they go to login.
  useEffect(() => {
    let cancelled = false;
    silentRefresh()
      .then((token) => {
        if (!cancelled) setAccessToken(token);
      })
      .catch(() => {
        if (!cancelled) setAccessToken(null);
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/v1/admin/logout");
    } catch {
      // ignore network errors on logout
    }
    setAccessToken(null);
  }, [setAccessToken]);

  // Decode role from JWT payload (no verification — server validates on every request)
  let role = null;
  if (accessToken) {
    try { role = JSON.parse(atob(accessToken.split(".")[1])).role ?? null; } catch { /* ignore */ }
  }
  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated: !!accessToken, isInitializing, logout, role, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
