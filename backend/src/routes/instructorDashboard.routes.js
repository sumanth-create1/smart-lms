import express from "express";

import {
  getInstructorDashboard,
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

export default router;