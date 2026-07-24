import express from "express";
import { enrollCourse , getMyCourses } from "../controllers/enrollment.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

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

export default router;