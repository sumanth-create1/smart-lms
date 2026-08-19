import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";
import Courses from "../components/common/Courses";


import ProtectedRoute from "./ProtectedRoute";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDashboardLayout from "../pages/student/Layouts/StudentDashboardLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<StudentDashboardLayout />}>

            <Route
              path="/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/courses"
              element={<Courses />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;