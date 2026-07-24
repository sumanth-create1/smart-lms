import express from "express";
import { getStudentCourse } from "../controllers/student.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";
import { checkLectureAccess } from "../middleware/checkLectureAccess.middleware.js";
import { getStudentLecture } from "../controllers/student.controller.js";
const router = express.Router();

router.get(
    "/course/:courseId",
    isAuthenticated,
    authorizeRoles("student"),
    getStudentCourse
);

router.get(
    "/lecture/:lectureId",
    isAuthenticated,
    checkLectureAccess,
    getStudentLecture
);

export default router;