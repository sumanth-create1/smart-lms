import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";

// =====================================================
// PUBLIC COURSE PAGES
// =====================================================

import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";

// =====================================================
// AUTH
// =====================================================

import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDashboardLayout from "../pages/student/Layouts/StudentDashboardLayout";
import StudentCourseLearning from "../pages/student/StudentCourseLearning";

// =====================================================
// INSTRUCTOR
// =====================================================

import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorDashboardLayout from "../pages/instructor/Layouts/InstructorDashboardLayout";
import InstructorCourses from "../pages/instructor/InstructorCourses";
import CreateCourse from "../pages/instructor/CreateCourse";
import CourseManagement from "../pages/instructor/CourseManagement";
import ManageLectures from "../pages/instructor/ManageLectures";
import InstructorProfile from "../pages/instructor/InstructorProfile";
import InstructorStudents from "../pages/instructor/InstructorStudents";
import InstructorStudentDetails from "../pages/instructor/InstructorStudentDetails";
import InstructorAnalytics from "../pages/instructor/InstructorAnalytics";

// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =================================================
            PUBLIC COURSE ROUTES
        =================================================

            These routes do NOT require authentication.

            Anyone can:
            - Browse courses
            - Search courses
            - Filter courses
            - View course details

        ================================================= */}

        <Route path="/courses" element={<StudentCourses />} />

        <Route path="/courses/:courseId" element={<StudentCourseDetails />} />

        {/* =================================================
            STUDENT PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<StudentDashboardLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Route>

          <Route
            path="/courses/:courseId/learn"
            element={<StudentCourseLearning />}
          />
        </Route>

        {/* =================================================
            INSTRUCTOR PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route element={<InstructorDashboardLayout />}>
            {/* Dashboard */}
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />

            {/* Courses */}
            <Route path="/instructor/courses" element={<InstructorCourses />} />

            {/* Create Course */}
            <Route
              path="/instructor/create-course"
              element={<CreateCourse />}
            />

            {/* Course Management */}
            <Route
              path="/instructor/courses/:courseId"
              element={<CourseManagement />}
            />

            {/* Manage Lectures */}
            <Route
              path="/instructor/courses/:courseId/lectures"
              element={<ManageLectures />}
            />

            {/* Students */}
            <Route
              path="/instructor/students"
              element={<InstructorStudents />}
            />

            {/* Student Details */}
            <Route
              path="/instructor/students/:studentId"
              element={<InstructorStudentDetails />}
            />

            {/* Analytics */}
            <Route
              path="/instructor/analytics"
              element={<InstructorAnalytics />}
            />

            {/* Profile */}
            <Route path="/instructor/profile" element={<InstructorProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
