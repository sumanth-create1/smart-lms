import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";

// =====================================================
// AUTH
// =====================================================

import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDashboardLayout from "../pages/student/Layouts/StudentDashboardLayout";
import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";

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
// ROUTES
// =====================================================

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* =================================================
            STUDENT ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["student"]} />
          }
        >
          <Route element={<StudentDashboardLayout />}>

            {/* Student Dashboard */}

            <Route
              path="/dashboard"
              element={<StudentDashboard />}
            />

            {/* All Courses */}

            <Route
              path="/courses"
              element={<StudentCourses />}
            />

            {/* Course Details */}

            <Route
              path="/courses/:courseId"
              element={<StudentCourseDetails />}
            />

          </Route>
        </Route>


        {/* =================================================
            INSTRUCTOR ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["instructor"]} />
          }
        >
          <Route element={<InstructorDashboardLayout />}>

            {/* Instructor Dashboard */}

            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />

            {/* Create Course */}

            <Route
              path="/instructor/create-course"
              element={<CreateCourse />}
            />

            {/* Instructor Courses */}

            <Route
              path="/instructor/courses"
              element={<InstructorCourses />}
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

            {/* Instructor Students */}

            <Route
              path="/instructor/students"
              element={<InstructorStudents />}
            />

            {/* Student Details */}

            <Route
              path="/instructor/students/:studentId"
              element={<InstructorStudentDetails />}
            />

            {/* Instructor Profile */}

            <Route
              path="/instructor/profile"
              element={<InstructorProfile />}
            />

            {/* Instructor Analytics */}

            <Route
              path="/instructor/analytics"
              element={<InstructorAnalytics />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;