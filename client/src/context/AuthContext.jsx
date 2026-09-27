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
  // DASHBOARD STATS
  // ===================================================

  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

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
      setDashboardStats(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // GET / REFRESH STUDENT DASHBOARD STATS
  // ===================================================

  const refreshDashboardStats = useCallback(async () => {
    try {
      // No logged-in user
      if (!user) {
        setDashboardStats(null);
        return null;
      }

      // Dashboard stats are only required for students
      if (user.role !== "student") {
        setDashboardStats(null);
        return null;
      }

      setDashboardLoading(true);

      const response = await api.get("/dashboard/student");

      if (response.data?.success) {
        const stats = response.data.stats || {};

        setDashboardStats(stats);

        return stats;
      }

      return null;
    } catch (error) {
      console.error(
        "❌ Dashboard stats error:",
        error.response?.data || error.message
      );

      return null;
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

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
      setDashboardStats(null);
    }
  }, []);

  // ===================================================
  // LOAD DASHBOARD AFTER AUTH
  // ===================================================

  useEffect(() => {
    if (!loading && user?.role === "student") {
      refreshDashboardStats();
    }

    if (!loading && user?.role !== "student") {
      setDashboardStats(null);
    }
  }, [
    loading,
    user,
    refreshDashboardStats,
  ]);

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
      // User
      user,
      setUser,
      updateUser,

      // Auth
      loading,
      login,
      logout,
      getCurrentUser,

      // Dashboard
      dashboardStats,
      dashboardLoading,
      refreshDashboardStats,
    }),
    [
      user,
      loading,
      login,
      logout,
      getCurrentUser,
      updateUser,
      dashboardStats,
      dashboardLoading,
      refreshDashboardStats,
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