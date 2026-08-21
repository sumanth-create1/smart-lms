import express from "express";

import {
  enrollCourse,
  getMyCourses,
  checkEnrollment,
} from "../controllers/enrollment.controller.js";

import { isAuthenticated,authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/:courseId",
    isAuthenticated,
    authorizeRoles("student"),
    enrollCourse
);

router.get(
    "/my-courses",
    isAuthenticated,
    authorizeRoles("student"),
    getMyCourses
);

// =====================================================
// CHECK ENROLLMENT
// =====================================================

router.get(
  "/check/:courseId",
  isAuthenticated,
  authorizeRoles("student"),
  checkEnrollment
);

export default router;