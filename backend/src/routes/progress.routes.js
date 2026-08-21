import express from "express";

import {
  saveProgress,
  getCourseProgress,
  markLectureCompleted,
  getLectureProgress,
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
  saveProgress
);

// =====================================================
// GET COURSE PROGRESS
// GET /api/v1/progress/course/:courseId
// =====================================================

router.get(
  "/course/:courseId",
  isAuthenticated,
  authorizeRoles("student"),
  getCourseProgress
);

// =====================================================
// MARK LECTURE AS COMPLETED
// PATCH /api/v1/progress/complete/:lectureId
// =====================================================

router.patch(
  "/complete/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  markLectureCompleted
);

// =====================================================
// GET LECTURE PROGRESS
// GET /api/v1/progress/lecture/:lectureId
// =====================================================

router.get(
  "/lecture/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  getLectureProgress
);

export default router;