import upload from "../middleware/upload.middleware.js";

import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadCourseThumbnail,
} from "../controllers/course.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("instructor"),
  createCourse,
);

router.get("/", getAllCourses);

router.get("/:id", getCourseById);

router.put(
    "/:id",
    isAuthenticated,
    authorizeRoles("instructor"),
    updateCourse
);

router.delete(
    "/:id",
    isAuthenticated,
    authorizeRoles("instructor"),
    deleteCourse
);

router.put(
    "/thumbnail/:courseId",
    isAuthenticated,
    authorizeRoles("instructor"),
    upload.single("thumbnail"),
    uploadCourseThumbnail
);
export default router;
