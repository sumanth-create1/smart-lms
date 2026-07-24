import express from "express";

import {
  createLecture,
  getCourseLectures,
  updateLecture,
  deleteLecture,
  uploadLectureVideo,
  getLectureById,
  togglePreview,
} from "../controllers/lecture.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/:courseId",
  isAuthenticated,
  authorizeRoles("instructor"),
  createLecture,
);

router.get("/course/:courseId", getCourseLectures);

router.put(
    "/:lectureId",
    isAuthenticated,
    authorizeRoles("instructor"),
    updateLecture
);

router.delete(
    "/delete/:lectureId",
    isAuthenticated,
    authorizeRoles("instructor"),
    deleteLecture
);

router.put(
    "/video/:lectureId",
    isAuthenticated,
    authorizeRoles("instructor"),
    upload.single("video"),
    uploadLectureVideo
);

router.get(
    "/:lectureId",
    isAuthenticated,
    authorizeRoles("instructor"),
    getLectureById
);

router.patch(
    "/preview/:lectureId",
    isAuthenticated,
    authorizeRoles("instructor"),
    togglePreview
);
export default router;
