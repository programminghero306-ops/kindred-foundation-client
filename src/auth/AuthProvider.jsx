import { useEffect, useState } from "react";
import {
  api,
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
  saveUser,
} from "../api";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!getToken()) {
        if (active) setReady(true);
        return;
      }

      try {
        const currentUser = await api.me();
        if (!active) return;
        setUser(currentUser);
        saveUser(currentUser);
      } catch {
        if (!active) return;
        clearSession();
        setUser(null);
      } finally {
        if (active) setReady(true);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    saveSession(data);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.register(payload);
    saveSession(data);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
