import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Wait until /auth/me finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="mt-4 text-sm text-gray-500">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return <Outlet />;
}

export default ProtectedRoute;