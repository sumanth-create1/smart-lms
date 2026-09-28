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
  // ACHIEVEMENTS
  // ===================================================

  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] =
    useState(false);

  // ===================================================
  // GET CURRENT USER
  // ===================================================

  const getCurrentUser = useCallback(async () => {
    try {
      console.log("🔐 Checking current user...");

      const response = await api.get("/auth/me");

      const currentUser = response.data?.user;

      if (!currentUser) {
        console.warn(
          "⚠️ /auth/me succeeded but no user data was returned."
        );

        setUser(null);
        setDashboardStats(null);
        setAchievements([]);

        return null;
      }

      console.log("✅ Current user:", currentUser);

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      // 401 simply means the user is not logged in.
      // Avoid treating it as an application error.
      if (error.response?.status !== 401) {
        console.error(
          "❌ Get current user error:",
          error.response?.data || error.message
        );
      }

      setUser(null);
      setDashboardStats(null);
      setAchievements([]);

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

      console.log("📊 Loading dashboard stats...");

      const response = await api.get("/dashboard/student");

      if (response.data?.success) {
        const stats = response.data.stats || {};

        setDashboardStats(stats);

        console.log(
          "✅ Dashboard stats loaded:",
          stats
        );

        return stats;
      }

      setDashboardStats(null);

      return null;
    } catch (error) {
      console.error(
        "❌ Dashboard stats error:",
        error.response?.data || error.message
      );

      setDashboardStats(null);

      return null;
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

  // ===================================================
  // GET ALL ACHIEVEMENTS
  // ===================================================

  const refreshAchievements = useCallback(async () => {
    try {
      // No logged-in user
      if (!user) {
        setAchievements([]);
        return [];
      }

      // Achievements are only required for students
      if (user.role !== "student") {
        setAchievements([]);
        return [];
      }

      setAchievementsLoading(true);

      console.log("🏆 Loading all achievements...");

      // /achievements/all returns all active achievements
      // together with unlocked status for this student.
      const response = await api.get("/achievements/all");

      console.log(
        "🏆 Achievement API response:",
        response.data
      );

      if (response.data?.success) {
        const achievementList = Array.isArray(
          response.data.achievements
        )
          ? response.data.achievements
          : [];

        setAchievements(achievementList);

        console.log(
          `✅ ${achievementList.length} achievements loaded`
        );

        return achievementList;
      }

      setAchievements([]);

      return [];
    } catch (error) {
      console.error(
        "❌ Achievements error:",
        error.response?.data || error.message
      );

      setAchievements([]);

      return [];
    } finally {
      setAchievementsLoading(false);
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

        const loggedInUser = response.data?.user;

        if (!loggedInUser) {
          throw new Error(
            "Login succeeded but user data was not returned."
          );
        }

        console.log(
          "✅ Login successful:",
          loggedInUser
        );

        setUser(loggedInUser);

        return response.data;
      } catch (error) {
        console.error(
          "❌ Login error:",
          error.response?.data || error.message
        );

        throw error;
      }
    },
    []
  );

  // ===================================================
  // UPDATE USER
  // ===================================================

  const updateUser = useCallback((updatedUser) => {
    if (!updatedUser) {
      console.warn(
        "⚠️ updateUser called without user data"
      );

      return;
    }

    setUser(updatedUser);
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "❌ Logout error:",
        error.response?.data || error.message
      );
    } finally {
      setUser(null);
      setDashboardStats(null);
      setAchievements([]);
    }
  }, []);

  // ===================================================
  // LOAD STUDENT DATA AFTER AUTH
  // ===================================================

  useEffect(() => {
    // Wait until authentication check is complete
    if (loading) {
      return;
    }

    // Student
    if (user?.role === "student") {
      refreshDashboardStats();
      refreshAchievements();

      return;
    }

    // Instructor / Admin / No user
    setDashboardStats(null);
    setAchievements([]);
  }, [
    loading,
    user,
    refreshDashboardStats,
    refreshAchievements,
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
      // -------------------------------
      // USER
      // -------------------------------
      user,
      setUser,
      updateUser,

      // -------------------------------
      // AUTH
      // -------------------------------
      loading,
      login,
      logout,
      getCurrentUser,

      // -------------------------------
      // DASHBOARD
      // -------------------------------
      dashboardStats,
      dashboardLoading,
      refreshDashboardStats,

      // -------------------------------
      // ACHIEVEMENTS
      // -------------------------------
      achievements,
      achievementsLoading,
      refreshAchievements,
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

      achievements,
      achievementsLoading,
      refreshAchievements,
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