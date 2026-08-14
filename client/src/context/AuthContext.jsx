import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================
  // GET CURRENT USER
  // =====================================

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user || response.data);
    } catch (error) {
      console.log("No authenticated user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOGIN
  // =====================================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(response.data.user || response.data);

    return response.data;
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  // =====================================
  // CHECK AUTH ON APP START
  // =====================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================
// CUSTOM HOOK
// =====================================

export function useAuth() {
  return useContext(AuthContext);
}