import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

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
        response.data.user || response.data;

      setUser(currentUser);

      console.log("Authenticated user:", currentUser);
    } catch (error) {
      console.log("No authenticated user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (email, password, role) => {
    try {
      // -----------------------------------------------
      // VALIDATE ROLE
      // -----------------------------------------------

      if (!role) {
        throw new Error(
          "Please select Student or Instructor."
        );
      }

      // -----------------------------------------------
      // LOGIN REQUEST
      // -----------------------------------------------

      const response = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      // -----------------------------------------------
      // GET USER FROM RESPONSE
      // -----------------------------------------------

      const loggedInUser =
        response.data.user || response.data;

      // -----------------------------------------------
      // SAVE USER
      // -----------------------------------------------

      setUser(loggedInUser);

      console.log(
        "Login successful:",
        loggedInUser
      );

      return response.data;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // Important:
      // Re-throw so Login.jsx can show
      // the error using react-hot-toast.

      throw error;
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setUser(null);
    }
  };

  // ===================================================
  // CHECK AUTH WHEN APP STARTS
  // ===================================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
  return useContext(AuthContext);
}