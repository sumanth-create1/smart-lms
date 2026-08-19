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

// CREATE
router.post(
  "/:courseId",
  isAuthenticated,
  authorizeRoles("instructor"),
  createLecture
);

// GET ALL COURSE LECTURES
router.get(
  "/course/:courseId",
  getCourseLectures
);

// DELETE
router.delete(
  "/delete/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  deleteLecture
);

// VIDEO UPLOAD
router.put(
  "/video/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  upload.single("video"),
  uploadLectureVideo
);

// TOGGLE PREVIEW
router.patch(
  "/preview/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  togglePreview
);

// UPDATE
router.put(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  updateLecture
);

// GET SINGLE LECTURE
// KEEP THIS LAST
router.get(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  getLectureById
);

export default router;