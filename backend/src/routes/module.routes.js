import express from "express";

import {
  createModule,
  getCourseModules,
  updateModule,
  deleteModule,
  resetModuleAssignments,
} from "../controllers/module.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/course/:courseId/modules",
  isAuthenticated,
  authorizeRoles("instructor"),
  createModule,
);

router.get("/course/:courseId/modules", isAuthenticated, getCourseModules);

router.put(
  "/module/:moduleId",
  isAuthenticated,
  authorizeRoles("instructor"),
  updateModule,
);

router.delete(
  "/module/:moduleId",
  isAuthenticated,
  authorizeRoles("instructor"),
  deleteModule,
);

router.patch(
  "/course/:courseId/modules/reset-assignments",
  isAuthenticated,
  authorizeRoles("instructor"),
  resetModuleAssignments
);

export default router;
