import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect / to /login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Any unknown URL → Login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

