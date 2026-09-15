import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // GET CURRENT USER
  // ===================================================

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      const currentUser =
        response.data?.user || response.data;

      setUser(currentUser);

      console.log("✅ Authenticated user:", currentUser);

      return currentUser;
    } catch (error) {
      console.log("ℹ️ No authenticated user");

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (email, password, role) => {
    try {
      if (!role) {
        throw new Error(
          "Please select Student or Instructor."
        );
      }

      const response = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      const loggedInUser =
        response.data?.user || response.data;

      setUser(loggedInUser);

      console.log(
        "✅ Login successful:",
        loggedInUser
      );

      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);

      throw error;
    }
  };

  // ===================================================
  // UPDATE USER
  // ===================================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      console.warn(
        "⚠️ updateUser called without user data"
      );
      return;
    }

    console.log(
      "🔄 Updating AuthContext user:",
      updatedUser
    );

    setUser(updatedUser);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  // ===================================================
  // CHECK AUTH ON APP START
  // ===================================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ===================================================
  // DEBUG
  // ===================================================

  console.log("🔐 AuthProvider rendered:", {
    user,
    loading,
  });

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        loading,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  console.log("🔍 useAuth context:", context);

  if (context === null) {
    throw new Error(
      "useAuth() must be used inside <AuthProvider>. " +
        "Check the AuthProvider wrapper and AuthContext import path."
    );
  }

  return context;
}