import express from "express";
import {
  saveProgress,
  getCourseProgress,
  markLectureCompleted,
} from "../controllers/progress.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles("student"),
  saveProgress,
);

router.get(
    "/course/:courseId",
    isAuthenticated,
    authorizeRoles("student"),
    getCourseProgress
);

router.patch(
    "/complete/:lectureId",
    isAuthenticated,
    authorizeRoles("student"),
    markLectureCompleted
);

export default router;
