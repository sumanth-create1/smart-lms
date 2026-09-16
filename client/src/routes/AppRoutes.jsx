import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Registration";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =====================================================
// PUBLIC COURSE PAGES
// =====================================================

import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";

// =====================================================
// AUTH / PROTECTION
// =====================================================

import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDashboardLayout from "../pages/student/Layouts/StudentDashboardLayout";
import StudentCourseLearning from "../pages/student/StudentCourseLearning";
import StudentProgress from "../pages/student/StudentProgress";
import Achievements from "../pages/student/Achievements";
import Settings from "../pages/student/Settings";
import Profile from "../pages/student/Profile";
import ModuleQuiz from "../pages/student/ModuleQuiz";

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
import ModuleManagement from "../pages/instructor/ModuleManagement";

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

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =================================================
            PASSWORD RECOVERY
        ================================================= */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* =================================================
            EMAIL VERIFICATION
        ================================================= */}

        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />

        {/* =================================================
            PUBLIC COURSE ROUTES
        ================================================= */}

        <Route
          path="/courses"
          element={<StudentCourses />}
        />

        <Route
          path="/courses/:courseId"
          element={<StudentCourseDetails />}
        />

        {/* =================================================
            STUDENT PROTECTED ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            />
          }
        >

          {/* =================================================
              STUDENT DASHBOARD LAYOUT
          ================================================= */}

          <Route element={<StudentDashboardLayout />}>

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<StudentDashboard />}
            />

            {/* Progress */}

            <Route
              path="/progress"
              element={<StudentProgress />}
            />

            {/* Achievements */}

            <Route
              path="/achievements"
              element={<Achievements />}
            />

            {/* Profile */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Settings */}

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

          {/* =================================================
              COURSE LEARNING
          ================================================= */}

          <Route
            path="/courses/:courseId/learn"
            element={<StudentCourseLearning />}
          />

          {/* =================================================
              MODULE QUIZ
          ================================================= */}

          <Route
            path="/dashboard/modules/:moduleId/quiz"
            element={<ModuleQuiz />}
          />

        </Route>

        {/* =================================================
            INSTRUCTOR PROTECTED ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["instructor"]}
            />
          }
        >

          {/* =================================================
              INSTRUCTOR DASHBOARD LAYOUT
          ================================================= */}

          <Route element={<InstructorDashboardLayout />}>

            {/* Dashboard */}

            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />

            {/* Courses */}

            <Route
              path="/instructor/courses"
              element={<InstructorCourses />}
            />

            {/* Create Course */}

            <Route
              path="/instructor/create-course"
              element={<CreateCourse />}
            />

            {/* =================================================
                COURSE MANAGEMENT
            ================================================= */}

            <Route
              path="/instructor/courses/:courseId"
              element={<CourseManagement />}
            />

            {/* =================================================
                MODULE MANAGEMENT
            ================================================= */}

            <Route
              path="/instructor/courses/:courseId/modules"
              element={<ModuleManagement />}
            />

            {/* =================================================
                MANAGE LECTURES
            ================================================= */}

            <Route
              path="/instructor/courses/:courseId/lectures"
              element={<ManageLectures />}
            />

            {/* =================================================
                STUDENTS
            ================================================= */}

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

            <Route
              path="/instructor/profile"
              element={<InstructorProfile />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;