import express from "express";

import {
  saveProgress,
  getCourseProgress,
  markLectureCompleted,
  unmarkLectureCompleted,
  getLectureProgress,
  getStudentProgress,
} from "../controllers/progress.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// SAVE LECTURE PROGRESS
// PATCH /api/v1/progress/:lectureId
// =====================================================

router.patch(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  saveProgress,
);

// =====================================================
// GET COURSE PROGRESS
// GET /api/v1/progress/course/:courseId
// =====================================================

router.get(
  "/course/:courseId",
  isAuthenticated,
  authorizeRoles("student"),
  getCourseProgress,
);

// =====================================================
// MARK LECTURE AS COMPLETED
// PATCH /api/v1/progress/complete/:lectureId
// =====================================================

router.patch(
  "/complete/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  markLectureCompleted,
);

// =====================================================
// MARK LECTURE AS INCOMPLETE
// PATCH /api/v1/progress/uncomplete/:lectureId
// =====================================================

router.patch(
  "/uncomplete/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  unmarkLectureCompleted,
);

// =====================================================
// GET LECTURE PROGRESS
// GET /api/v1/progress/lecture/:lectureId
// =====================================================

router.get(
  "/lecture/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  getLectureProgress,
);

// =====================================================
// GET STUDENT OVERALL PROGRESS
// GET /api/v1/progress/student
// =====================================================

router.get(
  "/student",
  isAuthenticated,
  authorizeRoles("student"),
  getStudentProgress,
);

export default router;
