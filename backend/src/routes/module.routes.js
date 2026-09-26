import express from "express";

import {
  createModule,
  getCourseModules,
  updateModule,
  deleteModule,
  resetModuleAssignments,
} from "../controllers/module.controller.js";

import {
  getModuleQuiz,
} from "../controllers/quiz.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Create module
router.post(
  "/course/:courseId/modules",
  isAuthenticated,
  authorizeRoles("instructor"),
  createModule
);

// Get course modules
router.get(
  "/course/:courseId/modules",
  isAuthenticated,
  getCourseModules
);

// Update module
router.put(
  "/module/:moduleId",
  isAuthenticated,
  authorizeRoles("instructor"),
  updateModule
);

// Delete module
router.delete(
  "/module/:moduleId",
  isAuthenticated,
  authorizeRoles("instructor"),
  deleteModule
);

// Reset assignments
router.patch(
  "/course/:courseId/modules/reset-assignments",
  isAuthenticated,
  authorizeRoles("instructor"),
  resetModuleAssignments
);

// Get module quiz
router.get(
  "/module/:moduleId/quiz",
  isAuthenticated,
  getModuleQuiz
);

export default router;