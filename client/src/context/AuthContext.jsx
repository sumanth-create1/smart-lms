import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");

      const currentUser =
        response.data?.user || response.data;

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = useCallback(
    async (email, password, role) => {
      try {
        if (!role) {
          throw new Error(
            "Please select Student or Instructor."
          );
        }

        const response = await api.post(
          "/auth/login",
          {
            email,
            password,
            role,
          }
        );

        const loggedInUser =
          response.data?.user ||
          response.data;

        setUser(loggedInUser);

        return response.data;
      } catch (error) {
        console.error(
          "❌ Login error:",
          error
        );

        throw error;
      }
    },
    []
  );

  // ===================================================
  // UPDATE USER
  // ===================================================

  const updateUser = useCallback(
    (updatedUser) => {
      if (!updatedUser) {
        console.warn(
          "⚠️ updateUser called without user data"
        );

        return;
      }

      setUser(updatedUser);
    },
    []
  );

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "❌ Logout error:",
        error
      );
    } finally {
      setUser(null);
    }
  }, []);

  // ===================================================
  // CHECK AUTH ON APP START
  // ===================================================

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // ===================================================
  // MEMOIZED CONTEXT VALUE
  // ===================================================

  const authValue = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      loading,
      login,
      logout,
      getCurrentUser,
    }),
    [
      user,
      loading,
      updateUser,
      login,
      logout,
      getCurrentUser,
    ]
  );

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      "useAuth() must be used inside <AuthProvider>. " +
        "Check the AuthProvider wrapper and AuthContext import path."
    );
  }

  return context;
}