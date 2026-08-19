import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";
import Courses from "../components/common/Courses";

import ProtectedRoute from "./ProtectedRoute";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDashboardLayout from "../pages/student/Layouts/StudentDashboardLayout";

import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorCourses from "../pages/instructor/InstructorCourses";
import InstructorDashboardLayout from "../pages/instructor/Layouts/InstructorDashboardLayout";
import CreateCourse from "../pages/instructor/CreateCourse";
import CourseManagement from "../pages/instructor/CourseManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================
            STUDENT ROUTES
        ========================= */}

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<StudentDashboardLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />

            <Route path="/courses" element={<Courses />} />
          </Route>
        </Route>

        {/* =========================
            INSTRUCTOR ROUTES
        ========================= */}

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route element={<InstructorDashboardLayout />}>
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />

            <Route
              path="/instructor/create-course"
              element={<CreateCourse />}
            />
            <Route path="/instructor/courses" element={<InstructorCourses />} />

            <Route
              path="/instructor/course/:courseId"
              element={<CourseManagement />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
