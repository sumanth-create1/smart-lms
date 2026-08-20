import express from "express";

import {
  getInstructorDashboard,
  getInstructorStudents,
  getInstructorStudentDetails,
  getInstructorAnalytics,
} from "../controllers/instructorDashboard.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/instructor",
  isAuthenticated,
  authorizeRoles("instructor"),
  getInstructorDashboard
);

router.get(
  "/instructor/students",
  isAuthenticated,
  authorizeRoles("instructor"),
  getInstructorStudents
);

router.get(
  "/instructor/students/:studentId",
  isAuthenticated,
  authorizeRoles("instructor"),
  getInstructorStudentDetails,
);

router.get(
  "/instructor/analytics",
  isAuthenticated,
  authorizeRoles("instructor"),
  getInstructorAnalytics
);

export default router;